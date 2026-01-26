import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  exchangeGoogleCode,
  getGoogleUserInfo,
  exchangeGithubCode,
  getGithubUserInfo,
  getGithubUserEmails,
  getPrimaryEmail,
} from "../services/oauth";
import { requireAuth } from "../middleware/auth";
import {
  createSession,
  revokeSession,
  revokeAllUserSessions,
} from "../services/session";
import {
  logLoginAttempt,
  checkSuspiciousActivity,
  logSensitiveOperation,
  logOAuthLink,
} from "../services/auditLogger";
import { rateLimitConfig } from "../middleware/rateLimit";

const prisma = new PrismaClient();

export async function authRoutes(fastify: FastifyInstance) {
  // Register with email/password
  fastify.post(
    "/auth/register",
    {
      config: { rateLimit: rateLimitConfig.register },
    },
    async (request, reply) => {
      const { email, password, name, username } = request.body as any;

      try {
        // Validate input
        if (!email || !password || !name || !username) {
          return reply.code(400).send({ error: "Missing required fields" });
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
          where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
          return reply.code(409).send({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
          data: {
            email,
            username,
            name,
            password: hashedPassword,
            role: "user",
            profileCompleted: true, // Basic registration considered complete
          },
        });

        // Create Secure Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
          {
            ipAddress: request.ip,
            userAgent: request.headers["user-agent"] || "unknown",
          },
        );

        // Set HttpOnly Cookie
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true in prod
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
          signed: false, // Session ID is random enough
        });

        // Log Success
        await logLoginAttempt(
          email,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
          user.id,
        );

        return {
          message: "Registration successful",
          csrfToken, // Send valid CSRF token to client
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Login with email/password
  fastify.post(
    "/auth/login",
    {
      config: { rateLimit: rateLimitConfig.login },
    },
    async (request, reply) => {
      const { email, password } = request.body as any;
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";

      try {
        // 1. Check Suspicious Activity
        const securityCheck = await checkSuspiciousActivity(email, ip);
        if (securityCheck.shouldLock) {
          await logSensitiveOperation(
            "system",
            "block_login",
            "auth",
            email,
            ip,
            userAgent,
            true,
            { reason: securityCheck.reason },
          );
          return reply.code(403).send({
            error: "Account Locked",
            message: "Too many failed attempts. Account temporarily locked.",
          });
        }

        if (!email || !password) {
          return reply.code(400).send({ error: "Email and password required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // 2. Validate Credentials
        if (!user || !user.password) {
          await logLoginAttempt(
            email,
            ip,
            userAgent,
            false,
            undefined,
            "invalid_credentials",
          );
          return reply.code(401).send({ error: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          await logLoginAttempt(
            email,
            ip,
            userAgent,
            false,
            user.id,
            "invalid_password",
          );
          return reply.code(401).send({ error: "Invalid credentials" });
        }

        // 3. Create Secure Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
          {
            ipAddress: ip,
            userAgent,
          },
        );

        // 4. Set HttpOnly Cookie
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // 5. Audit Log
        await logLoginAttempt(email, ip, userAgent, true, user.id);

        return {
          message: "Login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Google OAuth callback
  fastify.post(
    "/auth/google",
    {
      config: { rateLimit: rateLimitConfig.oauth },
    },
    async (request, reply) => {
      const { code } = request.body as { code: string };
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";

      try {
        if (!code) {
          return reply.code(400).send({ error: "Authorization code required" });
        }

        // Exchange code for tokens
        const tokenData = await exchangeGoogleCode(code);

        // Get user info from Google
        const googleUser = await getGoogleUserInfo(tokenData.access_token);

        // Find or create user logic (simplified for brevity)
        let user = await prisma.user.findFirst({
          where: { email: googleUser.email },
        });

        if (user) {
          // Link Verification
          const existingLink = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: googleUser.id,
              },
            },
          });

          if (!existingLink) {
            // Create link
            await prisma.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: "google",
                providerAccountId: googleUser.id,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                tokenType: tokenData.token_type,
                idToken: tokenData.id_token,
              },
            });
            await logOAuthLink(user.id, "google", "link", ip, userAgent);
          }
        } else {
          // Register new user
          const username =
            googleUser.email.split("@")[0] +
            "_" +
            Math.random().toString(36).substring(7);
          user = await prisma.user.create({
            data: {
              email: googleUser.email,
              username,
              name: googleUser.name,
              avatar: googleUser.picture,
              role: "user",
              emailVerified: true, // Google verified
              emailVerifiedAt: new Date(),
              oauthAccounts: {
                create: {
                  provider: "google",
                  providerAccountId: googleUser.id,
                  accessToken: tokenData.access_token,
                  refreshToken: tokenData.refresh_token,
                  tokenType: tokenData.token_type,
                  idToken: tokenData.id_token,
                },
              },
            },
          });
          await logSensitiveOperation(
            user.id,
            "register_oauth",
            "auth",
            "google",
            ip,
            userAgent,
            true,
          );
        }

        // Create Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          { userId: user.id, email: user.email, role: user.role },
          { ipAddress: ip, userAgent },
        );

        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
        });

        return {
          message: "OAuth login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
          },
        };
      } catch (error: any) {
        request.log.error(error);
        return reply
          .code(500)
          .send({ error: error.message || "OAuth authentication failed" });
      }
    },
  );

  // GitHub OAuth callback (Email Linking logic included)
  fastify.post(
    "/auth/github",
    {
      config: { rateLimit: rateLimitConfig.oauth },
    },
    async (request, reply) => {
      const { code } = request.body as { code: string };
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";

      try {
        if (!code)
          return reply.code(400).send({ error: "Authorization code required" });

        const tokenData = await exchangeGithubCode(code);
        const githubUser = await getGithubUserInfo(tokenData.access_token);

        let email = githubUser.email;
        if (!email) {
          const emails = await getGithubUserEmails(tokenData.access_token);
          email = getPrimaryEmail(emails);
        }

        if (!email)
          return reply
            .code(400)
            .send({ error: "No verified email found in GitHub account" });

        // Find existing user by email
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          // Link account
          const existingLink = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "github",
                providerAccountId: githubUser.id.toString(),
              },
            },
          });

          if (!existingLink) {
            await prisma.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: "github",
                providerAccountId: githubUser.id.toString(),
                accessToken: tokenData.access_token,
                scope: tokenData.scope,
              },
            });
            await logOAuthLink(user.id, "github", "link", ip, userAgent);
          }
        } else {
          // Register
          const username = githubUser.login;
          user = await prisma.user.create({
            data: {
              email,
              username,
              name: githubUser.name || username,
              avatar: githubUser.avatar_url,
              role: "user",
              emailVerified: true,
              emailVerifiedAt: new Date(),
              oauthAccounts: {
                create: {
                  provider: "github",
                  providerAccountId: githubUser.id.toString(),
                  accessToken: tokenData.access_token,
                  scope: tokenData.scope,
                },
              },
            },
          });
          await logSensitiveOperation(
            user.id,
            "register_oauth",
            "auth",
            "github",
            ip,
            userAgent,
            true,
          );
        }

        // Create Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          { userId: user.id, email: user.email, role: user.role },
          { ipAddress: ip, userAgent },
        );

        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
        });

        return {
          message: "OAuth login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
          },
        };
      } catch (error: any) {
        request.log.error(error);
        return reply
          .code(500)
          .send({ error: error.message || "OAuth authentication failed" });
      }
    },
  );

  // Logout
  fastify.post(
    "/auth/logout",
    { preHandler: requireAuth },
    async (request, reply) => {
      const sessionId = request.cookies.session_id;
      if (sessionId) {
        await revokeSession(sessionId);
        reply.clearCookie("session_id", { path: "/" });

        // Log logout
        const user = (request as any).user;
        await logLoginAttempt(
          user.email,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
          user.userId,
          "logout",
        );
      }
      return { message: "Logged out successfully" };
    },
  );

  // Global Logout (Invalidate ALL sessions)
  fastify.post(
    "/auth/logout-everywhere",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;

      try {
        // Increment token version to invalidate all past sessions
        await prisma.user.update({
          where: { id: user.userId },
          data: { tokenVersion: { increment: 1 } },
        });

        // Also revoke physical session records for good measure
        await revokeAllUserSessions(user.userId);

        reply.clearCookie("session_id", { path: "/" });
        return { message: "Logged out from all devices successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Email Verification ---
  fastify.post(
    "/auth/verify-email/request",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      // In a real app, you'd rate limit this aggressively

      try {
        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store token
        await prisma.verificationToken.create({
          data: {
            identifier: user.email,
            token,
            expires,
          },
        });

        // Mock Email Sending (Log to console)
        request.log.info(
          `[EMAIL MOCK] To: ${user.email} | Subject: Verify Email | Link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
        );

        return { message: "Verification email sent" };
      } catch (error) {
        request.log.error(error);
        return reply
          .code(500)
          .send({ error: "Failed to send verification email" });
      }
    },
  );

  fastify.post("/auth/verify-email/confirm", async (request, reply) => {
    const { token } = request.body as { token: string };

    if (!token) return reply.code(400).send({ error: "Token required" });

    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        return reply.code(400).send({ error: "Invalid token" });
      }

      if (verificationToken.expires < new Date()) {
        return reply.code(400).send({ error: "Token expired" });
      }

      // Verify User
      const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });
      if (!user) return reply.code(400).send({ error: "User not found" });

      // Update User
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      // Delete token
      await prisma.verificationToken.delete({ where: { token } });

      return { message: "Email verified successfully" };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Verification failed" });
    }
  });

  // Get Me (Protected)
  fastify.get(
    "/auth/me",
    { preHandler: requireAuth },
    async (request, reply) => {
      // Return session user (attached by middleware)
      return (request as any).user;
    },
  );

  // --- Profile Completion ---
  fastify.post(
    "/auth/profile/complete",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { username, name, bio, role } = request.body as any;
      const user = (request as any).user;

      try {
        const updatedUser = await prisma.user.update({
          where: { id: user.userId },
          data: {
            username,
            name,
            profileCompleted: true,
            // In a real app, storing bio/role would likely be in a Profile relation
            // For now updating core user if fields exist or ignoring
          },
        });
        return { message: "Profile updated", user: updatedUser };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Failed to update profile" });
      }
    },
  );

  // --- Session Management ---

  // Get active sessions
  fastify.get(
    "/auth/sessions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      const currentSessionId = request.cookies.session_id;

      try {
        const sessions = await prisma.session.findMany({
          where: {
            userId: user.userId,
            revokedAt: null,
            expiresAt: { gte: new Date() },
          },
          orderBy: { lastActivityAt: "desc" },
          select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            lastActivityAt: true,
            sessionId: true, // Need this to identify current session
          },
        });

        // Map to hide internal IDs and flag current session
        return sessions.map((s) => ({
          id: s.sessionId, // Use public session ID
          ipAddress: s.ipAddress,
          userAgent: s.userAgent,
          lastActivityAt: s.lastActivityAt,
          isCurrent: s.sessionId === currentSessionId,
        }));
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Revoke specific session
  fastify.delete(
    "/auth/sessions/:sessionId",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const user = (request as any).user;

      try {
        // Verify ownership
        const session = await prisma.session.findUnique({
          where: { sessionId },
        });

        if (!session || session.userId !== user.userId) {
          return reply.code(404).send({ error: "Session not found" });
        }

        await revokeSession(sessionId);
        return { message: "Session revoked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Revoke all other sessions
  fastify.delete(
    "/auth/sessions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      const currentSessionId = request.cookies.session_id;

      try {
        await prisma.session.updateMany({
          where: {
            userId: user.userId,
            sessionId: { not: currentSessionId }, // Keep current
            revokedAt: null,
          },
          data: { revokedAt: new Date() },
        });
        return { message: "All other sessions revoked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Audit Logs ---
  fastify.get(
    "/auth/audit-logs",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      try {
        // Fetch login attempts (since that's what the UI expects for now)
        // Ideally we'd merge ActivityLog and LoginAttempt or use just ActivityLog
        const logs = await prisma.loginAttempt.findMany({
          where: {
            userId: user.userId,
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        });

        return logs.map((l) => ({
          id: l.id,
          action: l.success ? "login_success" : "login_failed",
          ipAddress: l.ipAddress,
          userAgent: l.userAgent,
          success: l.success,
          createdAt: l.createdAt,
          details: { reason: l.failureReason },
        }));
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Linked Accounts ---
  fastify.get(
    "/auth/connections",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      try {
        const accounts = await prisma.oAuthAccount.findMany({
          where: { userId: user.userId },
          select: { provider: true },
        });

        return {
          google: accounts.some((a) => a.provider === "google"),
          github: accounts.some((a) => a.provider === "github"),
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  fastify.delete(
    "/auth/connections/:provider",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { provider } = request.params as { provider: string };
      const user = (request as any).user;

      try {
        // Prevent unlinking if it's the only method (simplified check)
        // Ideally check if password exists or other providers exist
        const connectionCount = await prisma.oAuthAccount.count({
          where: { userId: user.userId },
        });

        const dbUser = await prisma.user.findUnique({
          where: { id: user.userId },
          select: { password: true },
        });

        if (connectionCount <= 1 && !dbUser?.password) {
          return reply
            .code(400)
            .send({ error: "Cannot unlink last sign-in method" });
        }

        await prisma.oAuthAccount.deleteMany({
          where: {
            userId: user.userId,
            provider,
          },
        });

        return { message: "Account unlinked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Account Deletion ---
  fastify.delete(
    "/auth/account",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { password, confirmation } = request.body as any;
      const user = (request as any).user;

      if (confirmation !== "DELETE") {
        return reply.code(400).send({ error: "Invalid confirmation code" });
      }

      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (!dbUser) {
          return reply.code(404).send({ error: "User not found" });
        }

        // Verify password if user has one
        if (dbUser.password) {
          if (!password) {
            return reply.code(400).send({ error: "Password required" });
          }
          const isValid = await bcrypt.compare(password, dbUser.password);
          if (!isValid) {
            return reply.code(401).send({ error: "Invalid password" });
          }
        }

        // Soft delete user
        await prisma.user.update({
          where: { id: user.userId },
          data: {
            deletedAt: new Date(),
            deleteScheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            email: `deleted_${Date.now()}_${dbUser.email}`, // Free up email immediately
            username: `deleted_${Date.now()}_${dbUser.username}`,
          },
        });

        // Revoke all sessions
        await revokeSession(request.cookies.session_id); // Current
        await prisma.session.updateMany({
          where: { userId: user.userId },
          data: { revokedAt: new Date() },
        });

        // Log it
        await logSensitiveOperation(
          user.userId,
          "delete_account",
          "user",
          user.userId,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
        );

        reply.clearCookie("session_id", { path: "/" });
        return { message: "Account deleted successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
}
