var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// backend/services/docker.ts
var docker_exports = {};
__export(docker_exports, {
  DockerService: () => DockerService,
  docker: () => docker
});
import DockerModule from "dockerode";
import path from "path";
import fs from "fs/promises";
import process2 from "process";
var Docker, docker, DockerService;
var init_docker = __esm({
  "backend/services/docker.ts"() {
    Docker = DockerModule.default || DockerModule;
    docker = new Docker(
      process2.platform === "win32" ? { socketPath: "//./pipe/docker_engine" } : void 0
    );
    DockerService = class {
      // Create a new container for a workspace
      static async createContainer(workspaceId, image = "gitpod/openvscode-server:latest", port = 3e3) {
        const workspacePath = path.resolve(
          process2.cwd(),
          "workspaces",
          workspaceId
        );
        try {
          await fs.mkdir(workspacePath, { recursive: true });
        } catch (e) {
          console.error("Failed to create workspace dir", e);
        }
        const name = `trackcodex-${workspaceId}`;
        try {
          const old = docker.getContainer(name);
          await old.remove({ force: true });
        } catch (e) {
        }
        try {
          const imageInspect = await docker.getImage(image).inspect();
        } catch (e) {
          console.log(`Pulling image ${image}... this may take a while.`);
          await new Promise((resolve, reject) => {
            docker.pull(image, (err, stream) => {
              if (err) return reject(err);
              docker.modem.followProgress(stream, onFinished, onProgress);
              function onFinished(err2, output) {
                if (err2) return reject(err2);
                resolve(output);
              }
              function onProgress(event) {
              }
            });
          });
        }
        const container = await docker.createContainer({
          Image: image,
          name,
          Tty: true,
          ExposedPorts: {
            "3000/tcp": {}
          },
          HostConfig: {
            // Bind container port 3000 to dynamic host port
            PortBindings: {
              "3000/tcp": [{ HostPort: port.toString() }]
            },
            // Mount local workspace folder
            Binds: [
              `${workspacePath}:/home/workspace`,
              // Inject default settings for parity
              `${path.resolve(process2.cwd(), "config", "default-settings.json")}:/home/workspace/.vscode/settings.json`,
              // branding override (Attempt to override)
              `${path.resolve(process2.cwd(), "config", "product.json")}:/home/workspace/product.json`
            ],
            AutoRemove: true
          },
          Env: [
            "CONNECTION_TOKEN=trackcodex-secure-token",
            // Secure access in production
            "OPENVSCODE_SERVER_ROOT=/home/workspace",
            // Force theme (Note: OpenVSCode uses browser storage for some things, but file overrides help)
            'EXTENSIONS_GALLERY={"serviceUrl":"https://open-vsx.org/vscode/gallery","itemUrl":"https://open-vsx.org/vscode/item"}'
          ],
          // Command to start server without auth for local dev ease, or use token
          // Command to start server without auth for local dev ease, or use token
          // Pre-install critical extensions for Antigravity Parity
          Cmd: [
            "--port",
            "3000",
            "--host",
            "0.0.0.0",
            "--without-connection-token",
            "--telemetry-level",
            "off",
            "--install-extension",
            "dbaeumer.vscode-eslint",
            "--install-extension",
            "esbenp.prettier-vscode",
            "--install-extension",
            "ms-python.python",
            "--install-extension",
            "bradlc.vscode-tailwindcss",
            "/home/workspace"
          ]
        });
        await container.start();
        return { containerId: container.id, name, port };
      }
      // Execute command
      static async exec(containerId, cmd) {
        const container = docker.getContainer(containerId);
        const exec = await container.exec({
          Cmd: cmd,
          AttachStdout: true,
          AttachStderr: true
        });
        const stream = await exec.start({ hijack: true, stdin: false });
        return new Promise((resolve, reject) => {
          let output = "";
          container.modem.demuxStream(
            stream,
            {
              write: (chunk) => output += chunk.toString()
            },
            {
              write: (chunk) => output += chunk.toString()
            }
          );
          stream.on("end", () => resolve(output));
        });
      }
      // Stop
      static async stop(containerId) {
        const container = docker.getContainer(containerId);
        await container.stop();
      }
    };
  }
});

// backend/services/workspaceManager.ts
var workspaceManager_exports = {};
__export(workspaceManager_exports, {
  WorkspaceManager: () => WorkspaceManager
});
var activeWorkspaces, START_PORT, WorkspaceManager;
var init_workspaceManager = __esm({
  "backend/services/workspaceManager.ts"() {
    init_docker();
    activeWorkspaces = /* @__PURE__ */ new Map();
    START_PORT = 3001;
    WorkspaceManager = class {
      // Get an available port
      static async allocatePort() {
        let port = START_PORT;
        while (Array.from(activeWorkspaces.values()).includes(port)) {
          port++;
        }
        return port;
      }
      // Start a workspace container and return the access URL
      static async startWorkspace(workspaceId) {
        if (activeWorkspaces.has(workspaceId)) {
          const port2 = activeWorkspaces.get(workspaceId);
          return {
            url: `http://localhost:${port2}`,
            port: port2
          };
        }
        const port = await this.allocatePort();
        try {
          await DockerService.createContainer(
            workspaceId,
            "gitpod/openvscode-server:latest",
            port
          );
          activeWorkspaces.set(workspaceId, port);
          return {
            url: `http://localhost:${port}`,
            port
          };
        } catch (error) {
          console.error(`Failed to start workspace ${workspaceId}:`, error);
          throw error;
        }
      }
      static async stopWorkspace(workspaceId) {
        const containerName = `trackcodex-${workspaceId}`;
        try {
          const docker3 = (await Promise.resolve().then(() => (init_docker(), docker_exports))).docker;
          const container = docker3.getContainer(containerName);
          await container.stop();
        } catch (e) {
        }
        activeWorkspaces.delete(workspaceId);
      }
    };
  }
});

// backend/server.ts
import process4 from "process";
import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

// backend/routes/auth.ts
import { PrismaClient as PrismaClient4 } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto2 from "crypto";

// backend/services/oauth.ts
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
var GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback/google";
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
var GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/auth/callback/github";
async function exchangeGoogleCode(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code"
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google token exchange failed: ${error}`);
  }
  return response.json();
}
async function getGoogleUserInfo(accessToken) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Google user info");
  }
  return response.json();
}
async function exchangeGithubCode(code) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub token exchange failed: ${error}`);
  }
  return response.json();
}
async function getGithubUserInfo(accessToken) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json"
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user info");
  }
  return response.json();
}
async function getGithubUserEmails(accessToken) {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json"
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user emails");
  }
  return response.json();
}
function getPrimaryEmail(emails) {
  const primaryEmail = emails.find((e) => e.primary && e.verified);
  if (primaryEmail) return primaryEmail.email;
  const verifiedEmail = emails.find((e) => e.verified);
  if (verifiedEmail) return verifiedEmail.email;
  return emails[0]?.email || null;
}

// backend/services/session.ts
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
var prisma = new PrismaClient();
async function createSession(sessionId, data, metadata, expiresInMs = 7 * 24 * 60 * 60 * 1e3) {
  const expiresAt = new Date(Date.now() + expiresInMs);
  const csrfToken = crypto.randomBytes(32).toString("hex");
  let tokenVersion = data.tokenVersion;
  if (tokenVersion === void 0) {
    const user = await prisma.user.findUnique({ where: { id: data.userId }, select: { tokenVersion: true } });
    tokenVersion = user?.tokenVersion || 1;
  }
  await prisma.session.create({
    data: {
      sessionId,
      userId: data.userId,
      organizationId: data.organizationId || null,
      workspaceId: data.workspaceId || null,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      csrfToken,
      tokenVersion,
      expiresAt,
      lastActivityAt: /* @__PURE__ */ new Date()
    }
  });
  return { sessionId, csrfToken };
}
async function getSession(sessionId) {
  const session = await prisma.session.findUnique({
    where: { sessionId },
    include: { user: true }
  });
  if (!session) return null;
  if (session.tokenVersion !== session.user.tokenVersion) {
    await revokeSession(sessionId);
    return null;
  }
  if (session.expiresAt < /* @__PURE__ */ new Date()) {
    await revokeSession(sessionId);
    return null;
  }
  if (session.revokedAt) {
    return null;
  }
  await prisma.session.update({
    where: { sessionId },
    data: { lastActivityAt: /* @__PURE__ */ new Date() }
  });
  return {
    userId: session.userId,
    email: session.user.email,
    role: session.user.role,
    tokenVersion: session.tokenVersion,
    organizationId: session.organizationId || void 0,
    workspaceId: session.workspaceId || void 0,
    csrfToken: session.csrfToken
  };
}
async function revokeSession(sessionId) {
  await prisma.session.update({
    where: { sessionId },
    data: { revokedAt: /* @__PURE__ */ new Date() }
  }).catch(() => {
  });
}
async function revokeAllUserSessions(userId) {
  await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null
    },
    data: { revokedAt: /* @__PURE__ */ new Date() }
  });
}
async function validateCsrfToken(sessionId, token) {
  const session = await prisma.session.findUnique({
    where: { sessionId },
    select: { csrfToken: true }
  });
  return session?.csrfToken === token;
}

// backend/middleware/auth.ts
import { PrismaClient as PrismaClient2 } from "@prisma/client";
var prisma2 = new PrismaClient2();
async function requireAuth(request, reply) {
  try {
    const sessionId = request.cookies?.session_id;
    if (!sessionId) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "No session cookie found"
      });
    }
    const sessionData = await getSession(sessionId);
    if (!sessionData) {
      reply.clearCookie("session_id");
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Session expired or invalid"
      });
    }
    request.user = {
      userId: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role,
      organizationId: sessionData.organizationId,
      workspaceId: sessionData.workspaceId
    };
    request.csrfToken = sessionData.csrfToken;
  } catch (error) {
    return reply.code(401).send({
      error: "Unauthorized",
      message: error.message || "Authentication failed"
    });
  }
}
function requireRole(...allowedRoles) {
  return async (request, reply) => {
    await requireAuth(request, reply);
    const user = request.user;
    if (!user) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Authentication required"
      });
    }
    if (!allowedRoles.includes(user.role)) {
      return reply.code(403).send({
        error: "Forbidden",
        message: `Insufficient permissions. Required role: ${allowedRoles.join(" or ")}`
      });
    }
  };
}

// backend/services/auditLogger.ts
import { PrismaClient as PrismaClient3 } from "@prisma/client";
var prisma3 = new PrismaClient3();
async function logAuditEvent(event) {
  try {
    await prisma3.activityLog.create({
      data: {
        userId: event.userId || null,
        action: event.action,
        details: {
          resource: event.resource,
          resourceId: event.resourceId,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          success: event.success,
          failureReason: event.failureReason,
          ...event.metadata
        }
      }
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}
async function logLoginAttempt(email, ipAddress, userAgent, success, userId, failureReason) {
  try {
    await prisma3.loginAttempt.create({
      data: {
        userId,
        email,
        ipAddress,
        userAgent,
        success,
        failureReason
      }
    });
    await logAuditEvent({
      userId,
      action: success ? "login_success" : "login_failure",
      resource: "auth",
      ipAddress,
      userAgent,
      success,
      failureReason,
      metadata: { email }
    });
  } catch (error) {
    console.error("Failed to log login attempt:", error);
  }
}
async function checkSuspiciousActivity(email, ipAddress) {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1e3);
  const recentFailures = await prisma3.loginAttempt.count({
    where: {
      email,
      success: false,
      createdAt: {
        gte: fifteenMinutesAgo
      }
    }
  });
  if (recentFailures >= 5) {
    return {
      shouldLock: true,
      reason: "Too many failed login attempts",
      failedAttempts: recentFailures
    };
  }
  const recentAttempts = await prisma3.loginAttempt.findMany({
    where: {
      email,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1e3)
        // 5 minutes
      }
    },
    select: { ipAddress: true },
    distinct: ["ipAddress"]
  });
  if (recentAttempts.length >= 3) {
    return {
      shouldLock: true,
      reason: "Multiple login attempts from different locations"
    };
  }
  return { shouldLock: false };
}
async function logOAuthLink(userId, provider, action, ipAddress, userAgent) {
  await logAuditEvent({
    userId,
    action: `oauth_${action}`,
    resource: "oauth_account",
    resourceId: provider,
    ipAddress,
    userAgent,
    success: true,
    metadata: { provider }
  });
}
async function logSensitiveOperation(userId, operation, resource, resourceId, ipAddress, userAgent, success, metadata) {
  await logAuditEvent({
    userId,
    action: operation,
    resource,
    resourceId,
    ipAddress,
    userAgent,
    success,
    metadata
  });
}

// backend/middleware/rateLimit.ts
var rateLimitConfig = {
  // Login attempts: 5 per 15 minutes
  login: {
    max: 5,
    timeWindow: "15 minutes",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many login attempts. Please try again in 15 minutes.",
      retryAfter: 900
      // 15 minutes in seconds
    })
  },
  // Registration: 3 per hour
  register: {
    max: 3,
    timeWindow: "1 hour",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many registration attempts. Please try again later.",
      retryAfter: 3600
    })
  },
  // OAuth: 10 per hour
  oauth: {
    max: 10,
    timeWindow: "1 hour",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many OAuth attempts. Please try again later.",
      retryAfter: 3600
    })
  },
  // Password reset: 3 per hour per email
  passwordReset: {
    max: 3,
    timeWindow: "1 hour",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many password reset requests. Please check your email.",
      retryAfter: 3600
    })
  },
  // OTP sending: 5 per hour
  otpSend: {
    max: 5,
    timeWindow: "1 hour",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many OTP requests. Please try again later.",
      retryAfter: 3600
    })
  },
  // General API: 100 requests per 15 minutes
  general: {
    max: 100,
    timeWindow: "15 minutes",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please slow down.",
      retryAfter: 900
    })
  }
};
function rateLimitKeyGenerator(request) {
  const ip = request.ip;
  const userId = request.user?.userId;
  return userId ? `${ip}:${userId}` : ip;
}

// backend/routes/auth.ts
var prisma4 = new PrismaClient4();
async function authRoutes(fastify) {
  fastify.post(
    "/auth/register",
    {
      config: { rateLimit: rateLimitConfig.register }
    },
    async (request, reply) => {
      const { email, password, name, username } = request.body;
      try {
        if (!email || !password || !name || !username) {
          return reply.code(400).send({ error: "Missing required fields" });
        }
        const existingUser = await prisma4.user.findFirst({
          where: { OR: [{ email }, { username }] }
        });
        if (existingUser) {
          return reply.code(409).send({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma4.user.create({
          data: {
            email,
            username,
            name,
            password: hashedPassword,
            role: "user",
            profileCompleted: true
            // Basic registration considered complete
          }
        });
        const sessionId = crypto2.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            role: user.role
          },
          {
            ipAddress: request.ip,
            userAgent: request.headers["user-agent"] || "unknown"
          }
        );
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // true in prod
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          // 7 days in seconds
          signed: false
          // Session ID is random enough
        });
        await logLoginAttempt(
          email,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
          user.id
        );
        return {
          message: "Registration successful",
          csrfToken,
          // Send valid CSRF token to client
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role
          }
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.post(
    "/auth/login",
    {
      config: { rateLimit: rateLimitConfig.login }
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";
      try {
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
            { reason: securityCheck.reason }
          );
          return reply.code(403).send({
            error: "Account Locked",
            message: "Too many failed attempts. Account temporarily locked."
          });
        }
        if (!email || !password) {
          return reply.code(400).send({ error: "Email and password required" });
        }
        const user = await prisma4.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          await logLoginAttempt(
            email,
            ip,
            userAgent,
            false,
            void 0,
            "invalid_credentials"
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
            "invalid_password"
          );
          return reply.code(401).send({ error: "Invalid credentials" });
        }
        const sessionId = crypto2.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            role: user.role
          },
          {
            ipAddress: ip,
            userAgent
          }
        );
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60
          // 7 days
        });
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
            role: user.role
          }
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.post(
    "/auth/google",
    {
      config: { rateLimit: rateLimitConfig.oauth }
    },
    async (request, reply) => {
      const { code } = request.body;
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";
      try {
        if (!code) {
          return reply.code(400).send({ error: "Authorization code required" });
        }
        const tokenData = await exchangeGoogleCode(code);
        const googleUser = await getGoogleUserInfo(tokenData.access_token);
        let user = await prisma4.user.findFirst({
          where: { email: googleUser.email }
        });
        if (user) {
          const existingLink = await prisma4.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: googleUser.id
              }
            }
          });
          if (!existingLink) {
            await prisma4.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: "google",
                providerAccountId: googleUser.id,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                tokenType: tokenData.token_type,
                idToken: tokenData.id_token
              }
            });
            await logOAuthLink(user.id, "google", "link", ip, userAgent);
          }
        } else {
          const username = googleUser.email.split("@")[0] + "_" + Math.random().toString(36).substring(7);
          user = await prisma4.user.create({
            data: {
              email: googleUser.email,
              username,
              name: googleUser.name,
              avatar: googleUser.picture,
              role: "user",
              emailVerified: true,
              // Google verified
              emailVerifiedAt: /* @__PURE__ */ new Date(),
              oauthAccounts: {
                create: {
                  provider: "google",
                  providerAccountId: googleUser.id,
                  accessToken: tokenData.access_token,
                  refreshToken: tokenData.refresh_token,
                  tokenType: tokenData.token_type,
                  idToken: tokenData.id_token
                }
              }
            }
          });
          await logSensitiveOperation(
            user.id,
            "register_oauth",
            "auth",
            "google",
            ip,
            userAgent,
            true
          );
        }
        const sessionId = crypto2.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          { userId: user.id, email: user.email, role: user.role },
          { ipAddress: ip, userAgent }
        );
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60
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
            avatar: user.avatar
          }
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: error.message || "OAuth authentication failed" });
      }
    }
  );
  fastify.post(
    "/auth/github",
    {
      config: { rateLimit: rateLimitConfig.oauth }
    },
    async (request, reply) => {
      const { code } = request.body;
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
          return reply.code(400).send({ error: "No verified email found in GitHub account" });
        let user = await prisma4.user.findUnique({ where: { email } });
        if (user) {
          const existingLink = await prisma4.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "github",
                providerAccountId: githubUser.id.toString()
              }
            }
          });
          if (!existingLink) {
            await prisma4.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: "github",
                providerAccountId: githubUser.id.toString(),
                accessToken: tokenData.access_token,
                scope: tokenData.scope
              }
            });
            await logOAuthLink(user.id, "github", "link", ip, userAgent);
          }
        } else {
          const username = githubUser.login;
          user = await prisma4.user.create({
            data: {
              email,
              username,
              name: githubUser.name || username,
              avatar: githubUser.avatar_url,
              role: "user",
              emailVerified: true,
              emailVerifiedAt: /* @__PURE__ */ new Date(),
              oauthAccounts: {
                create: {
                  provider: "github",
                  providerAccountId: githubUser.id.toString(),
                  accessToken: tokenData.access_token,
                  scope: tokenData.scope
                }
              }
            }
          });
          await logSensitiveOperation(
            user.id,
            "register_oauth",
            "auth",
            "github",
            ip,
            userAgent,
            true
          );
        }
        const sessionId = crypto2.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          { userId: user.id, email: user.email, role: user.role },
          { ipAddress: ip, userAgent }
        );
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60
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
            avatar: user.avatar
          }
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: error.message || "OAuth authentication failed" });
      }
    }
  );
  fastify.post(
    "/auth/logout",
    { preHandler: requireAuth },
    async (request, reply) => {
      const sessionId = request.cookies.session_id;
      if (sessionId) {
        await revokeSession(sessionId);
        reply.clearCookie("session_id", { path: "/" });
        const user = request.user;
        await logLoginAttempt(
          user.email,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
          user.userId,
          "logout"
        );
      }
      return { message: "Logged out successfully" };
    }
  );
  fastify.post(
    "/auth/logout-everywhere",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      try {
        await prisma4.user.update({
          where: { id: user.userId },
          data: { tokenVersion: { increment: 1 } }
        });
        await revokeAllUserSessions(user.userId);
        reply.clearCookie("session_id", { path: "/" });
        return { message: "Logged out from all devices successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.post(
    "/auth/verify-email/request",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      try {
        const token = crypto2.randomUUID();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
        await prisma4.verificationToken.create({
          data: {
            identifier: user.email,
            token,
            expires
          }
        });
        request.log.info(
          `[EMAIL MOCK] To: ${user.email} | Subject: Verify Email | Link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`
        );
        return { message: "Verification email sent" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Failed to send verification email" });
      }
    }
  );
  fastify.post("/auth/verify-email/confirm", async (request, reply) => {
    const { token } = request.body;
    if (!token) return reply.code(400).send({ error: "Token required" });
    try {
      const verificationToken = await prisma4.verificationToken.findUnique({
        where: { token }
      });
      if (!verificationToken) {
        return reply.code(400).send({ error: "Invalid token" });
      }
      if (verificationToken.expires < /* @__PURE__ */ new Date()) {
        return reply.code(400).send({ error: "Token expired" });
      }
      const user = await prisma4.user.findUnique({
        where: { email: verificationToken.identifier }
      });
      if (!user) return reply.code(400).send({ error: "User not found" });
      await prisma4.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: /* @__PURE__ */ new Date()
        }
      });
      await prisma4.verificationToken.delete({ where: { token } });
      return { message: "Email verified successfully" };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Verification failed" });
    }
  });
  fastify.get(
    "/auth/me",
    { preHandler: requireAuth },
    async (request, reply) => {
      return request.user;
    }
  );
  fastify.post(
    "/auth/profile/complete",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { username, name, bio, role } = request.body;
      const user = request.user;
      try {
        const updatedUser = await prisma4.user.update({
          where: { id: user.userId },
          data: {
            username,
            name,
            profileCompleted: true
            // In a real app, storing bio/role would likely be in a Profile relation
            // For now updating core user if fields exist or ignoring
          }
        });
        return { message: "Profile updated", user: updatedUser };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Failed to update profile" });
      }
    }
  );
  fastify.get(
    "/auth/sessions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      const currentSessionId = request.cookies.session_id;
      try {
        const sessions = await prisma4.session.findMany({
          where: {
            userId: user.userId,
            revokedAt: null,
            expiresAt: { gte: /* @__PURE__ */ new Date() }
          },
          orderBy: { lastActivityAt: "desc" },
          select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            lastActivityAt: true,
            sessionId: true
            // Need this to identify current session
          }
        });
        return sessions.map((s) => ({
          id: s.sessionId,
          // Use public session ID
          ipAddress: s.ipAddress,
          userAgent: s.userAgent,
          lastActivityAt: s.lastActivityAt,
          isCurrent: s.sessionId === currentSessionId
        }));
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.delete(
    "/auth/sessions/:sessionId",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { sessionId } = request.params;
      const user = request.user;
      try {
        const session = await prisma4.session.findUnique({
          where: { sessionId }
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
    }
  );
  fastify.delete(
    "/auth/sessions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      const currentSessionId = request.cookies.session_id;
      try {
        await prisma4.session.updateMany({
          where: {
            userId: user.userId,
            sessionId: { not: currentSessionId },
            // Keep current
            revokedAt: null
          },
          data: { revokedAt: /* @__PURE__ */ new Date() }
        });
        return { message: "All other sessions revoked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.get(
    "/auth/audit-logs",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      try {
        const logs = await prisma4.loginAttempt.findMany({
          where: {
            userId: user.userId
          },
          orderBy: { createdAt: "desc" },
          take: 20
        });
        return logs.map((l) => ({
          id: l.id,
          action: l.success ? "login_success" : "login_failed",
          ipAddress: l.ipAddress,
          userAgent: l.userAgent,
          success: l.success,
          createdAt: l.createdAt,
          details: { reason: l.failureReason }
        }));
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.get(
    "/auth/connections",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      try {
        const accounts = await prisma4.oAuthAccount.findMany({
          where: { userId: user.userId },
          select: { provider: true }
        });
        return {
          google: accounts.some((a) => a.provider === "google"),
          github: accounts.some((a) => a.provider === "github")
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.delete(
    "/auth/connections/:provider",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { provider } = request.params;
      const user = request.user;
      try {
        const connectionCount = await prisma4.oAuthAccount.count({
          where: { userId: user.userId }
        });
        const dbUser = await prisma4.user.findUnique({
          where: { id: user.userId },
          select: { password: true }
        });
        if (connectionCount <= 1 && !dbUser?.password) {
          return reply.code(400).send({ error: "Cannot unlink last sign-in method" });
        }
        await prisma4.oAuthAccount.deleteMany({
          where: {
            userId: user.userId,
            provider
          }
        });
        return { message: "Account unlinked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
  fastify.delete(
    "/auth/account",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { password, confirmation } = request.body;
      const user = request.user;
      if (confirmation !== "DELETE") {
        return reply.code(400).send({ error: "Invalid confirmation code" });
      }
      try {
        const dbUser = await prisma4.user.findUnique({
          where: { id: user.userId }
        });
        if (!dbUser) {
          return reply.code(404).send({ error: "User not found" });
        }
        if (dbUser.password) {
          if (!password) {
            return reply.code(400).send({ error: "Password required" });
          }
          const isValid = await bcrypt.compare(password, dbUser.password);
          if (!isValid) {
            return reply.code(401).send({ error: "Invalid password" });
          }
        }
        await prisma4.user.update({
          where: { id: user.userId },
          data: {
            deletedAt: /* @__PURE__ */ new Date(),
            deleteScheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
            // 30 days
            email: `deleted_${Date.now()}_${dbUser.email}`,
            // Free up email immediately
            username: `deleted_${Date.now()}_${dbUser.username}`
          }
        });
        await revokeSession(request.cookies.session_id);
        await prisma4.session.updateMany({
          where: { userId: user.userId },
          data: { revokedAt: /* @__PURE__ */ new Date() }
        });
        await logSensitiveOperation(
          user.userId,
          "delete_account",
          "user",
          user.userId,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true
        );
        reply.clearCookie("session_id", { path: "/" });
        return { message: "Account deleted successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

// backend/routes/auth_otp.ts
import { PrismaClient as PrismaClient5 } from "@prisma/client";
var prisma5 = new PrismaClient5();
var generateOTP = () => Math.floor(1e5 + Math.random() * 9e5).toString();
async function authOtpRoutes(fastify) {
  fastify.post("/auth/otp/send", async (request, reply) => {
    const { email } = request.body;
    if (!email) return reply.code(400).send({ error: "Email required" });
    const user = await prisma5.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(404).send({ error: "User not found. Please sign up first." });
    }
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    await prisma5.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt: expiresAt
      }
    });
    console.log(`\x1B[33m[EMAIL MOCK] Sending OTP to ${email}: ${otp}\x1B[0m`);
    return { success: true, message: "OTP sent to email." };
  });
  fastify.post("/auth/otp/verify", async (request, reply) => {
    const { email, code } = request.body;
    const user = await prisma5.user.findUnique({ where: { email } });
    if (!user) return reply.code(400).send({ error: "User not found" });
    if (!user.otpCode || !user.otpExpiresAt) {
      return reply.code(400).send({ error: "No OTP requested" });
    }
    if (/* @__PURE__ */ new Date() > user.otpExpiresAt) {
      return reply.code(400).send({ error: "OTP expired" });
    }
    if (user.otpCode !== code) {
      return reply.code(400).send({ error: "Invalid code" });
    }
    await prisma5.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiresAt: null }
    });
    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
  });
}

// backend/routes/workspaces.ts
import { PrismaClient as PrismaClient6 } from "@prisma/client";
var prisma6 = new PrismaClient6();
async function workspaceRoutes(fastify) {
  fastify.get("/workspaces", async (request, reply) => {
    const workspaces = await prisma6.workspace.findMany({
      include: { owner: true }
    });
    return workspaces;
  });
  fastify.post("/workspaces", async (request, reply) => {
    const { name, description, ownerId } = request.body;
    let finalOwnerId = ownerId;
    if (!finalOwnerId) {
      const firstUser = await prisma6.user.findFirst();
      if (!firstUser)
        return reply.code(400).send({ message: "No users exist. Register first." });
      finalOwnerId = firstUser.id;
    }
    const workspace = await prisma6.workspace.create({
      data: {
        name,
        description,
        ownerId: finalOwnerId,
        status: "Starting"
      }
    });
    return workspace;
  });
  fastify.get("/workspaces/:id", async (request, reply) => {
    const { id } = request.params;
    const workspace = await prisma6.workspace.findUnique({
      where: { id },
      include: { owner: true }
    });
    return workspace || reply.code(404).send({ message: "Workspace not found" });
  });
  fastify.post("/workspaces/:id/start", async (request, reply) => {
    const { id } = request.params;
    const workspace = await prisma6.workspace.findUnique({ where: { id } });
    if (!workspace)
      return reply.code(404).send({ message: "Workspace not found" });
    try {
      const { WorkspaceManager: WorkspaceManager2 } = await Promise.resolve().then(() => (init_workspaceManager(), workspaceManager_exports));
      const result = await WorkspaceManager2.startWorkspace(id);
      await prisma6.workspace.update({
        where: { id },
        data: { status: "Running" }
      });
      return result;
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: "Failed to start workspace environment",
        error: error.message
      });
    }
  });
  fastify.patch("/workspaces/:id/status", async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body;
    const workspace = await prisma6.workspace.update({
      where: { id },
      data: { status }
    });
    return workspace;
  });
}

// backend/routes/repositories.ts
import { PrismaClient as PrismaClient7 } from "@prisma/client";
var prisma7 = new PrismaClient7();
async function repositoryRoutes(fastify) {
  fastify.get("/repositories", async (request, reply) => {
    const repositories = await prisma7.repository.findMany({
      include: {
        org: true,
        securityAlerts: true
        // Include alerts summary
      }
    });
    return repositories;
  });
  fastify.get("/repositories/:id", async (request, reply) => {
    const { id } = request.params;
    const repo = await prisma7.repository.findUnique({
      where: { id },
      include: {
        org: true,
        securityAlerts: true,
        aiTasks: true
        // Include AI tasks history
      }
    });
    if (!repo) return reply.code(404).send({ message: "Repository not found" });
    return repo;
  });
  fastify.post("/repositories", async (request, reply) => {
    const { name, description, isPublic, techStack, orgId } = request.body;
    const repo = await prisma7.repository.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        language: techStack,
        // Mapping techStack to language for simplicity in this model
        orgId,
        // Optional link to org
        stars: 0,
        forks: 0
      }
    });
    return repo;
  });
  fastify.post("/repositories/:id/analyze", async (request, reply) => {
    const { id } = request.params;
    const task = await prisma7.aITask.create({
      data: {
        repoId: id,
        taskName: "Code Quality Analysis",
        model: "DeepSeek-r1",
        status: "Processing",
        result: null
      }
    });
    return { message: "Analysis started", taskId: task.id };
  });
}

// backend/routes/jobs.ts
import { PrismaClient as PrismaClient8 } from "@prisma/client";
var prisma8 = new PrismaClient8();
var jobsCache = null;
var lastCacheUpdate = 0;
var CACHE_TTL = 3e4;
async function jobRoutes(fastify) {
  fastify.get("/jobs", async (request, reply) => {
    const now = Date.now();
    if (jobsCache && now - lastCacheUpdate < CACHE_TTL) {
      console.log("[Backend Cache] Serving jobs from memory");
      return jobsCache;
    }
    const jobs = await prisma8.job.findMany({
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        org: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    jobsCache = jobs;
    lastCacheUpdate = now;
    return jobs;
  });
  fastify.get("/jobs/:id", async (request, reply) => {
    const { id } = request.params;
    const job = await prisma8.job.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        org: { select: { id: true, name: true, avatar: true } },
        applications: {
          select: { id: true, status: true, applicantId: true }
          // Minimal data for checking status
        }
      }
    });
    if (!job) return reply.code(404).send({ message: "Job not found" });
    return job;
  });
  fastify.post("/jobs", async (request, reply) => {
    const { title, description, budget, type, techStack, creatorId, orgId, repoId } = request.body;
    let finalCreatorId = creatorId;
    if (!finalCreatorId) {
      const user = await prisma8.user.findFirst();
      if (!user) return reply.code(400).send({ message: "No users found" });
      finalCreatorId = user.id;
    }
    const job = await prisma8.job.create({
      data: {
        title,
        description,
        budget,
        type,
        techStack: techStack || [],
        // Array of strings
        status: "Open",
        creatorId: finalCreatorId,
        orgId,
        repositoryId: repoId
      }
    });
    return job;
  });
  fastify.post("/jobs/:id/apply", async (request, reply) => {
    const { id } = request.params;
    const { applicantId } = request.body;
    if (!applicantId) return reply.code(400).send({ message: "Applicant ID required" });
    const existingApp = await prisma8.jobApplication.findFirst({
      where: { jobId: id, applicantId }
    });
    if (existingApp) return reply.code(409).send({ message: "Already applied" });
    const application = await prisma8.jobApplication.create({
      data: {
        jobId: id,
        applicantId,
        status: "Pending"
      }
    });
    return { success: true, applicationId: application.id };
  });
  fastify.post("/jobs/:id/complete", async (request, reply) => {
    const { id } = request.params;
    const { rating, feedback, freelancerId } = request.body;
    if (!rating || !freelancerId) return reply.code(400).send({ message: "Missing rating or freelancerId" });
    try {
      const result = await prisma8.$transaction(async (tx) => {
        const job = await tx.job.update({
          where: { id },
          data: { status: "Completed" }
        });
        let targetFreelancerId = freelancerId;
        if (freelancerId === "test-user-id-for-demo") {
          const candidate = await tx.user.findFirst({
            where: { id: { not: job.creatorId } }
          });
          if (candidate) {
            targetFreelancerId = candidate.id;
          } else {
            targetFreelancerId = job.creatorId;
          }
        }
        const review = await tx.jobReview.create({
          data: {
            jobId: id,
            freelancerId: targetFreelancerId,
            // Actually links to FreelancerProfile.id? No, schema says FreelancerProfile
            reviewerId: job.creatorId,
            rating,
            comment: feedback
          }
        });
        const freelancerProfile = await tx.freelancerProfile.upsert({
          where: { userId: targetFreelancerId },
          // freelancerId param is likely the User ID
          create: {
            userId: targetFreelancerId,
            jobsCompleted: 1,
            rating,
            isPublic: true
          },
          update: {
            jobsCompleted: { increment: 1 }
            // Recalculating average is tricky atomically with just update
            // Simplify: We will just update count here, and recalculate rating below
          }
        });
        const allReviews = await tx.jobReview.findMany({
          where: { freelancerId: freelancerProfile.id }
        });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / allReviews.length;
        await tx.freelancerProfile.update({
          where: { id: freelancerProfile.id },
          data: { rating: avgRating }
        });
        return { job, review, freelancerProfile };
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("Complete Job Error:", error);
      return reply.code(500).send({ message: "Failed to complete job", error });
    }
  });
  fastify.post("/jobs/:id/dispute", async (request, reply) => {
    const { id } = request.params;
    const userId = request.headers["x-user-id"] || "user-1";
    const escrow = await prisma8.escrowContract.findUnique({ where: { jobId: id } });
    if (!escrow || escrow.status !== "HELD") {
      return reply.code(400).send({ error: "No active escrow to dispute." });
    }
    const job = await prisma8.job.findUnique({ where: { id } });
    await prisma8.escrowContract.update({
      where: { id: escrow.id },
      data: { status: "DISPUTED" }
    });
    return { success: true, message: "Funds frozen. Support team notified." };
  });
  fastify.post("/jobs/:id/fund", async (request, reply) => {
    const { id } = request.params;
    const userId = request.headers["x-user-id"] || "user-1";
    const job = await prisma8.job.findUnique({ where: { id } });
    if (!job) return reply.code(404).send({ error: "Job not found" });
    const wallet = await prisma8.wallet.findUnique({ where: { userId } });
    if (!wallet) return reply.code(400).send({ error: "Wallet not found. Please deposit funds first." });
    const amount = parseFloat(job.budget?.replace(/[^0-9.]/g, "") || "0");
    if (amount <= 0) return reply.code(400).send({ error: "Invalid job budget to fund." });
    if (wallet.balance < amount) {
      return reply.code(402).send({ error: "Insufficient funds." });
    }
    try {
      await prisma8.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: amount } }
        });
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            amount: -amount,
            type: "ESCROW_HOLD",
            description: `Funded Escrow for Job: ${job.title}`,
            referenceId: job.id
          }
        });
        await tx.escrowContract.create({
          data: {
            jobId: job.id,
            amountLocked: amount,
            status: "HELD"
          }
        });
      });
      return { success: true, message: "Funds secured in Escrow." };
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ error: "Escrow failed." });
    }
  });
  fastify.post("/jobs/:id/release", async (request, reply) => {
    const { id } = request.params;
    const escrow = await prisma8.escrowContract.findUnique({ where: { jobId: id } });
    if (!escrow || escrow.status !== "HELD") {
      return reply.code(400).send({ error: "No active escrow funds found for this job." });
    }
    const { freelancerId } = request.body;
    let targetUserId = freelancerId;
    if (!targetUserId) {
      return reply.code(400).send({ error: "Target Freelancer ID required." });
    }
    try {
      await prisma8.$transaction(async (tx) => {
        await tx.escrowContract.update({
          where: { id: escrow.id },
          data: { status: "RELEASED" }
        });
        let fWallet = await tx.wallet.findUnique({ where: { userId: targetUserId } });
        if (!fWallet) {
          fWallet = await tx.wallet.create({ data: { userId: targetUserId, balance: 0 } });
        }
        await tx.wallet.update({
          where: { id: fWallet.id },
          data: { balance: { increment: escrow.amountLocked } }
        });
        await tx.transaction.create({
          data: {
            walletId: fWallet.id,
            amount: escrow.amountLocked,
            type: "RELEASE",
            description: `Payment Released for Job #${id}`,
            referenceId: id
          }
        });
      });
      return { success: true, message: "Payment released to freelancer." };
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ error: "Release failed." });
    }
  });
}

// backend/routes/organizations.ts
import { PrismaClient as PrismaClient11 } from "@prisma/client";

// backend/middleware/roles.ts
import { PrismaClient as PrismaClient9 } from "@prisma/client";
var prisma9 = new PrismaClient9();
var RoleHierarchy = {
  ["OWNER" /* OWNER */]: 4,
  ["ADMIN" /* ADMIN */]: 3,
  ["MEMBER" /* MEMBER */]: 2,
  ["GUEST" /* GUEST */]: 1
};
var RoleGuard = class {
  // Check if user has at least the required role
  static async hasRole(userId, orgId, requiredRole) {
    const member = await prisma9.orgMember.findUnique({
      where: {
        orgId_userId: {
          orgId,
          userId
        }
      }
    });
    if (!member) return false;
    const userLevel = RoleHierarchy[member.role] || 0;
    const requiredLevel = RoleHierarchy[requiredRole];
    return userLevel >= requiredLevel;
  }
  // specific check for Owner
  static async isOwner(userId, orgId) {
    return this.hasRole(userId, orgId, "OWNER" /* OWNER */);
  }
};

// backend/services/audit.ts
import { PrismaClient as PrismaClient10 } from "@prisma/client";
var prisma10 = new PrismaClient10();
var AuditService = class {
  static async log(userId, action, metadata = {}, workspaceId, orgId) {
    try {
      await prisma10.activityLog.create({
        data: {
          userId,
          action,
          metadata: { ...metadata, orgId },
          workspaceId,
          createdAt: /* @__PURE__ */ new Date()
        }
      });
      console.log(`\x1B[36m[AUDIT] ${userId} performed ${action}\x1B[0m`);
    } catch (e) {
      console.error("Failed to write audit log", e);
    }
  }
  static async getLogs(userId) {
    return prisma10.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }
};

// backend/routes/organizations.ts
var prisma11 = new PrismaClient11();
async function orgRoutes(fastify) {
  fastify.get("/orgs", async (request, reply) => {
    const userId = request.headers["x-user-id"];
    if (!userId) return reply.code(401).send({ error: "Unauthorized" });
    const members = await prisma11.orgMember.findMany({
      where: { userId },
      include: { org: true }
    });
    return members.map((m) => ({ ...m.org, role: m.role }));
  });
  fastify.post("/orgs", async (request, reply) => {
    const { name } = request.body;
    const userId = request.headers["x-user-id"];
    const org = await prisma11.organization.create({
      data: { name }
    });
    await prisma11.orgMember.create({
      data: {
        userId,
        orgId: org.id,
        role: "OWNER"
        // Prisma Enum String
      }
    });
    await AuditService.log(userId, "ORG_CREATE", { name, orgId: org.id });
    return org;
  });
  fastify.post("/orgs/:id/invite", async (request, reply) => {
    const { id } = request.params;
    const { targetUserId, role } = request.body;
    const userId = request.headers["x-user-id"];
    const canInvite = await RoleGuard.hasRole(userId, id, "ADMIN" /* ADMIN */);
    if (!canInvite) {
      await AuditService.log(userId, "ORG_INVITE_DENIED", { orgId: id, reason: "Insufficient Permissions" });
      return reply.code(403).send({ error: "Access Denied: Admin role required." });
    }
    try {
      const membership = await prisma11.orgMember.create({
        data: {
          orgId: id,
          userId: targetUserId,
          role: role || "MEMBER"
        }
      });
      await AuditService.log(userId, "ORG_INVITE", { orgId: id, targetUserId, role });
      return membership;
    } catch (e) {
      return reply.code(400).send({ error: "User likely already a member." });
    }
  });
  fastify.get("/orgs/:id/logs", async (request, reply) => {
    const { id } = request.params;
    const userId = request.headers["x-user-id"];
    const isOwner = await RoleGuard.isOwner(userId, id);
    if (!isOwner) return reply.code(403).send({ error: "Access Denied: Owner role required." });
    return { logs: [{ action: "ORG_CREATE", timestamp: /* @__PURE__ */ new Date() }] };
  });
}

// backend/routes/community.ts
import { PrismaClient as PrismaClient12 } from "@prisma/client";
var prisma12 = new PrismaClient12();
async function communityRoutes(fastify) {
  fastify.get("/community/posts", async (request, reply) => {
    const posts = await prisma12.communityPost.findMany({
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        comments: true
      },
      orderBy: { createdAt: "desc" }
    });
    return posts;
  });
  fastify.post("/community/posts", async (request, reply) => {
    const { title, content, authorId } = request.body;
    if (!authorId) return reply.code(400).send({ message: "Author ID required" });
    const post = await prisma12.communityPost.create({
      data: {
        title,
        content,
        authorId
      }
    });
    return post;
  });
  fastify.post("/community/posts/:id/comments", async (request, reply) => {
    const { id } = request.params;
    const { text, authorId } = request.body;
    const comment = await prisma12.communityComment.create({
      data: {
        postId: id,
        text,
        authorId
      }
    });
    return comment;
  });
}

// backend/routes/profile.ts
import { PrismaClient as PrismaClient13 } from "@prisma/client";
var prisma13 = new PrismaClient13();
var heatmapCache = /* @__PURE__ */ new Map();
var HEATMAP_TTL = 6e4;
async function profileRoutes(fastify) {
  fastify.get("/profile/:username", async (request, reply) => {
    const { username } = request.params;
    const user = await prisma13.user.findUnique({
      where: { username },
      include: {
        profile: { include: { socialLinks: true } },
        relations: false
        // skipping for brevity
      }
    });
    if (!user) return reply.code(404).send({ message: "User not found" });
    const freelancerProfile = await prisma13.freelancerProfile.findUnique({
      where: { userId: user.id },
      include: { reviews: true }
    });
    return {
      user,
      freelancerProfile
    };
  });
  fastify.get("/profile/:username/contributions", async (request, reply) => {
    const { username } = request.params;
    const now = Date.now();
    const cached = heatmapCache.get(username);
    if (cached && now - cached.timestamp < HEATMAP_TTL) {
      console.log(`[Cache] Serving heatmap for ${username}`);
      return cached.data;
    }
    const user = await prisma13.user.findUnique({ where: { username } });
    if (!user) return reply.code(404).send({ message: "User not found" });
    const dailyData = await prisma13.dailyContribution.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" }
    });
    const total = dailyData.reduce((acc, curr) => acc + curr.count, 0);
    const toDate = /* @__PURE__ */ new Date();
    const fromDate = /* @__PURE__ */ new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    const result = {
      total_contributions: total,
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
      contributions: dailyData.map((d) => ({
        date: d.date,
        count: d.count,
        level: d.level
      }))
    };
    heatmapCache.set(username, { data: result, timestamp: now });
    return result;
  });
  fastify.get("/profile/:username/heatmap", async (request, reply) => {
    const { username } = request.params;
    const user = await prisma13.user.findUnique({ where: { username } });
    if (!user) return reply.code(404).send({ message: "User not found" });
    const oneYearAgo = /* @__PURE__ */ new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const logs = await prisma13.activityLog.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: oneYearAgo }
      },
      select: { createdAt: true, action: true }
    });
    return { logs, total: logs.length };
  });
  fastify.get("/profile/:username/ai-usage", async (request, reply) => {
    const { username } = request.params;
    const user = await prisma13.user.findUnique({ where: { username } });
    if (!user) return reply.code(404).send({ message: "User not found" });
    const logs = await prisma13.aIUsageLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100
      // Limit for now
    });
    const totalTokens = await prisma13.aIUsageLog.aggregate({
      where: { userId: user.id },
      _sum: { tokensUsed: true }
    });
    return { logs, totalTokens: totalTokens._sum.tokensUsed || 0 };
  });
  fastify.post("/profile/activity", async (request, reply) => {
    const { username, action, metadata } = request.body;
    const user = await prisma13.user.findUnique({ where: { username } });
    if (!user) {
      const firstUser = await prisma13.user.findFirst();
      if (!firstUser) return reply.code(400).send({ message: "No users found" });
      var userId = firstUser.id;
    } else {
      var userId = user.id;
    }
    await prisma13.activityLog.create({
      data: {
        userId,
        action,
        metadata: metadata || {}
      }
    });
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const daily = await prisma13.dailyContribution.upsert({
      where: {
        userId_date: { userId, date: today }
      },
      create: {
        userId,
        date: today,
        count: 1,
        level: 1
      },
      update: {
        count: { increment: 1 }
      }
    });
    let newLevel = 1;
    if (daily.count >= 5) newLevel = 2;
    if (daily.count >= 10) newLevel = 3;
    if (daily.count >= 15) newLevel = 4;
    await prisma13.dailyContribution.update({
      where: { id: daily.id },
      data: { level: newLevel }
    });
    return { success: true, count: daily.count };
  });
  fastify.post("/profile/seed-stats", async (request, reply) => {
    const { userId } = request.body;
    if (!userId) return reply.code(400).send({ message: "UserId required" });
    await prisma13.dailyContribution.deleteMany({ where: { userId } });
    await prisma13.activityLog.deleteMany({ where: { userId } });
    const dailyMap = {};
    const now = /* @__PURE__ */ new Date();
    const logs = [];
    for (let i = 0; i < 500; i++) {
      const offset = Math.floor(Math.random() * 365);
      const date = new Date(now.getTime() - offset * 24 * 60 * 60 * 1e3);
      const dateStr = date.toISOString().split("T")[0];
      logs.push({
        userId,
        action: "commit",
        createdAt: date,
        metadata: {}
      });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
    }
    await prisma13.activityLog.createMany({ data: logs });
    const maxCount = Math.max(...Object.values(dailyMap), 1);
    const contributions = Object.entries(dailyMap).map(([date, count]) => {
      let level = 0;
      if (count > 0) level = 1;
      if (count >= maxCount * 0.25) level = 2;
      if (count >= maxCount * 0.5) level = 3;
      if (count >= maxCount * 0.75) level = 4;
      return { userId, date, count, level };
    });
    await prisma13.dailyContribution.createMany({ data: contributions });
    return { success: true, message: "Seeded aggregated analytics" };
  });
}

// backend/routes/forge.ts
init_docker();

// backend/services/terminal.ts
import { createRequire } from "module";
import process3 from "process";
import fs2 from "fs";
import path2 from "path";
var require2 = createRequire(import.meta.url);
var Docker2 = require2("dockerode");
var docker2 = new Docker2(
  process3.platform === "win32" ? { socketPath: "//./pipe/docker_engine" } : void 0
);
var LOG_FILE = path2.join(process3.cwd(), "terminal-error.log");
var TerminalService = class {
  static async handleConnection(connection, req) {
    const { workspaceId } = req.params;
    const socket = connection.socket || connection;
    console.log(`\u{1F50C} Terminal connection attempt for workspace: ${workspaceId}`);
    fs2.appendFileSync(LOG_FILE, `
--- Connection: ${(/* @__PURE__ */ new Date()).toISOString()} ---
`);
    if (!socket || typeof socket.on !== "function") {
      const errorMsg = "Critical: No valid WebSocket found on connection object.";
      console.error(errorMsg);
      fs2.appendFileSync(LOG_FILE, `${errorMsg}
Connection keys: ${Object.keys(connection || {})}
`);
      return;
    }
    try {
      const containerName = `trackcodex-${workspaceId}`;
      const container = docker2.getContainer(containerName);
      try {
        await container.inspect();
      } catch (err) {
        fs2.appendFileSync(LOG_FILE, `Inspect failed: ${err.message}
`);
        socket.send("\r\n\x1B[31m[System] Container not found or not running.\x1B[0m\r\n");
        socket.close();
        return;
      }
      const exec = await container.exec({
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Cmd: ["sh"]
      });
      const stream = await exec.start({
        hijack: true,
        stdin: true
      });
      if (!stream) {
        throw new Error("Terminal stream could not be initialized.");
      }
      stream.on("data", (chunk) => {
        if (socket.readyState === 1) {
          socket.send(chunk.toString("utf-8"));
        }
      });
      stream.on("error", (err) => {
        fs2.appendFileSync(LOG_FILE, `Docker Stream Error: ${err.stack}
`);
        if (socket.readyState === 1) socket.close();
      });
      stream.on("end", () => {
        if (socket.readyState === 1) {
          socket.send("\r\n[System] Session ended.\r\n");
          socket.close();
        }
      });
      socket.on("message", (data) => {
        if (stream && stream.writable) {
          stream.write(data.toString());
        }
      });
      socket.on("close", () => {
        fs2.appendFileSync(LOG_FILE, `WebSocket closed by client.
`);
        if (stream) stream.end();
      });
      socket.on("error", (err) => {
        fs2.appendFileSync(LOG_FILE, `WebSocket Error: ${err.stack}
`);
      });
      socket.send("\r\n\x1B[32m[System] Terminal ready.\x1B[0m\r\n$ ");
    } catch (error) {
      fs2.appendFileSync(LOG_FILE, `Fatal Error: ${error.stack}
`);
      console.error("Terminal Failure (logged)");
      if (socket.readyState === 1) {
        socket.send(`\r
\x1B[31m[Critical Error] ${error.message}\x1B[0m\r
`);
        socket.close();
      }
    }
  }
};

// backend/routes/forge.ts
import path3 from "path";
import fs3 from "fs/promises";
async function forgeRoutes(fastify) {
  fastify.get("/forge/terminal/:workspaceId", { websocket: true }, (connection, req) => {
    TerminalService.handleConnection(connection, req).catch((err) => {
      fastify.log.error("Terminal WebSocket Error: " + err.message);
    });
  });
  fastify.post("/forge/create", async (request, reply) => {
    const { workspaceId, framework } = request.body;
    try {
      const result = await DockerService.createContainer(workspaceId, "node:18-alpine");
      const wsPath = path3.resolve(__dirname, `../../workspaces/${workspaceId}`);
      await fs3.writeFile(path3.join(wsPath, "index.js"), '// Start coding here\nconsole.log("Hello from The Forge!");');
      return { success: true, containerId: result.containerId };
    } catch (e) {
      console.error("Workspace Creation Error:", e);
      return reply.code(500).send({ error: "Failed to create workspace" });
    }
  });
  fastify.get("/forge/files/:workspaceId", async (request, reply) => {
    const { workspaceId } = request.params;
    const rootPath = path3.resolve(__dirname, `../../workspaces/${workspaceId}`);
    const getFiles = async (dir) => {
      const dirents = await fs3.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(dirents.map((dirent) => {
        const res = path3.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      }));
      return Array.prototype.concat(...files);
    };
    try {
      const files = await getFiles(rootPath);
      return files.map((f) => f.replace(rootPath, "").replace(/\\/g, "/"));
    } catch (e) {
      return [];
    }
  });
  fastify.get("/forge/files/:workspaceId/content", async (request, reply) => {
    const { workspaceId } = request.params;
    const { path: filePath } = request.query;
    if (!filePath) return reply.code(400).send({ error: "File path required" });
    if (filePath.includes("..")) return reply.code(403).send({ error: "Invalid path" });
    const fullPath = path3.resolve(__dirname, `../../workspaces/${workspaceId}`, filePath);
    try {
      const content = await fs3.readFile(fullPath, "utf-8");
      return { content };
    } catch (e) {
      return reply.code(404).send({ error: "File not found" });
    }
  });
  fastify.post("/forge/files/:workspaceId/save", async (request, reply) => {
    const { workspaceId } = request.params;
    const { path: filePath, content } = request.body;
    if (!filePath || content === void 0) return reply.code(400).send({ error: "Path and content required" });
    if (filePath.includes("..")) return reply.code(403).send({ error: "Invalid path" });
    const fullPath = path3.resolve(__dirname, `../../workspaces/${workspaceId}`, filePath);
    try {
      await fs3.writeFile(fullPath, content);
      return { success: true };
    } catch (e) {
      return reply.code(500).send({ error: "Failed to save file" });
    }
  });
  fastify.post("/forge/git/push", async (request, reply) => {
    const { repoId, userId } = request.body;
    const isSoloRepo = repoId.endsWith("-solo");
    if (isSoloRepo) {
      return { success: true, message: "Push allowed (Solo Developer Mode)." };
    } else {
      const { prStatus } = request.body;
      if (prStatus !== "APPROVED") {
        return reply.code(403).send({
          error: "Push Rejected: Admin Approval Required.",
          details: "This repository is in Team Mode. Direct pushes are blocked. Please submit a Pull Request and wait for Admin Approval (AHI Risk Score check)."
        });
      }
      return { success: true, message: "Push allowed (PR Approved)." };
    }
  });
}

// backend/services/notification.ts
import { PrismaClient as PrismaClient15 } from "@prisma/client";

// backend/services/chat.ts
import { PrismaClient as PrismaClient14 } from "@prisma/client";
import { WebSocket } from "ws";
var prisma14 = new PrismaClient14();
var connections = /* @__PURE__ */ new Map();
var ChatService = class {
  static async handleConnection(connection, req) {
    const socket = connection.socket;
    const { userId } = req.query;
    if (!userId) {
      socket.close();
      return;
    }
    console.log(`\u{1F4AC} User connected to Chat: ${userId}`);
    if (!connections.has(userId)) {
      connections.set(userId, /* @__PURE__ */ new Set());
    }
    connections.get(userId).add(socket);
    socket.on("message", async (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.type === "dm") {
          const { receiverId, content } = payload;
          const msg = await prisma14.message.create({
            data: {
              senderId: userId,
              receiverId,
              content
            }
          });
          const receiverSockets = connections.get(receiverId);
          if (receiverSockets) {
            receiverSockets.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: "dm",
                  message: msg
                }));
              }
            });
          }
          socket.send(JSON.stringify({ type: "ack", id: msg.id }));
        }
      } catch (e) {
        console.error("Chat Error:", e);
      }
    });
    socket.on("close", () => {
      const userConns = connections.get(userId);
      if (userConns) {
        userConns.delete(socket);
        if (userConns.size === 0) connections.delete(userId);
      }
    });
  }
  // Helper to send system notification
  static sendNotification(userId, notification) {
    const userConns = connections.get(userId);
    if (userConns) {
      userConns.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "notification", data: notification }));
        }
      });
    }
  }
};

// backend/services/notification.ts
var prisma15 = new PrismaClient15();
var NotificationService = class {
  // Create & Broadcast
  static async create(userId, type, title, message) {
    try {
      const notif = await prisma15.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          read: false
        }
      });
      ChatService.sendNotification(userId, notif);
      return notif;
    } catch (e) {
      console.error("Failed to create notification", e);
    }
  }
  // Get All for User
  static async getAll(userId) {
    return prisma15.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }
  // Mark as Read
  static async markRead(id) {
    return prisma15.notification.update({
      where: { id },
      data: { read: true }
    });
  }
  // Mark All Read
  static async markAllRead(userId) {
    return prisma15.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }
};

// backend/routes/notifications.ts
async function notificationRoutes(fastify) {
  fastify.get("/notifications", async (request, reply) => {
    const { userId } = request.query;
    if (!userId) return reply.code(400).send({ error: "UserId required" });
    const list = await NotificationService.getAll(userId);
    return list;
  });
  fastify.post("/notifications/:id/read", async (request, reply) => {
    const { id } = request.params;
    await NotificationService.markRead(id);
    return { success: true };
  });
  fastify.post("/notifications/read-all", async (request, reply) => {
    const { userId } = request.body;
    await NotificationService.markAllRead(userId);
    return { success: true };
  });
}

// backend/routes/admin.ts
import { PrismaClient as PrismaClient16 } from "@prisma/client";
var prisma16 = new PrismaClient16();
async function adminRoutes(fastify) {
  fastify.addHook("preHandler", requireRole("admin"));
  fastify.get("/admin/users", async (request, reply) => {
    const { page = 1, limit = 20, search } = request.query;
    const skip = (Number(page) - 1) * Number(limit);
    try {
      const whereClause = search ? {
        OR: [
          { email: { contains: search } },
          { username: { contains: search } }
        ]
      } : {};
      const [users, total] = await Promise.all([
        prisma16.user.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            accountLocked: true,
            createdAt: true,
            _count: { select: { sessions: true } }
          }
        }),
        prisma16.user.count({ where: whereClause })
      ]);
      return {
        data: users,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to fetch users" });
    }
  });
  fastify.post("/admin/users/:userId/ban", async (request, reply) => {
    const { userId } = request.params;
    const { reason } = request.body;
    const adminUser = request.user;
    try {
      if (userId === adminUser.userId) {
        return reply.code(400).send({ error: "Cannot ban yourself" });
      }
      const updatedUser = await prisma16.user.update({
        where: { id: userId },
        data: { accountLocked: true }
      });
      await revokeAllUserSessions(userId);
      await logSensitiveOperation(
        adminUser.userId,
        "ban_user",
        "user",
        userId,
        request.ip,
        request.headers["user-agent"] || "system",
        true,
        { reason }
      );
      return { message: `User ${updatedUser.email} has been banned and sessions revoked.` };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to ban user" });
    }
  });
  fastify.post("/admin/users/:userId/unban", async (request, reply) => {
    const { userId } = request.params;
    const adminUser = request.user;
    try {
      await prisma16.user.update({
        where: { id: userId },
        data: { accountLocked: false }
      });
      await logSensitiveOperation(
        adminUser.userId,
        "unban_user",
        "user",
        userId,
        request.ip,
        request.headers["user-agent"] || "system",
        true
      );
      return { message: "User unbanned" };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to unban user" });
    }
  });
}

// backend/routes/search.ts
import { PrismaClient as PrismaClient17 } from "@prisma/client";
var prisma17 = new PrismaClient17();
async function searchRoutes(fastify) {
  fastify.get("/search", { preHandler: requireAuth }, async (request, reply) => {
    const { q } = request.query;
    const user = request.user;
    if (!q || q.length < 2) {
      return { results: [] };
    }
    const query = q.toLowerCase();
    try {
      const [users, orgs, repos, workspaces, jobs] = await Promise.all([
        // 1. Users (People)
        prisma17.user.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              // Case insensitive in standard SQL, Prisma standard depends on DB
              { username: { contains: query } },
              { email: { contains: query } }
            ]
          },
          take: 5,
          select: { id: true, name: true, username: true, avatar: true }
        }),
        // 2. Organizations
        prisma17.organization.findMany({
          where: { name: { contains: query } },
          take: 5,
          select: { id: true, name: true }
        }),
        // 3. Repositories (Public or member of Org)
        // For simplicity: All public + explicit checks ideally
        prisma17.repository.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } }
            ]
            // isPublic: true // Assume public for search scope in this demo
          },
          take: 5,
          select: { id: true, name: true, description: true }
        }),
        // 4. Workspaces (Owned by user)
        prisma17.workspace.findMany({
          where: {
            ownerId: user.userId,
            name: { contains: query }
          },
          take: 5,
          select: { id: true, name: true, status: true }
        }),
        // 5. Jobs
        prisma17.job.findMany({
          where: {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } }
            ]
          },
          take: 5,
          select: { id: true, title: true, budget: true, type: true }
        })
      ]);
      const results = [
        ...orgs.map((o) => ({
          id: `org-${o.id}`,
          type: "org",
          label: o.name,
          icon: "domain",
          group: "Organizations",
          url: `/org/${o.id}`
        })),
        ...repos.map((r) => ({
          id: `repo-${r.id}`,
          type: "repo",
          label: r.name,
          subLabel: r.description,
          icon: "book",
          group: "Repositories",
          url: `/repo/${r.id}`
        })),
        ...workspaces.map((w) => ({
          id: `ws-${w.id}`,
          type: "workspace",
          label: w.name,
          subLabel: w.status,
          icon: "terminal",
          group: "Workspaces",
          url: `/workspace/${w.id}`
        })),
        ...jobs.map((j) => ({
          id: `job-${j.id}`,
          type: "job",
          label: j.title,
          subLabel: `${j.type} - ${j.budget}`,
          icon: "work",
          group: "Jobs",
          url: `/jobs/${j.id}`
        })),
        ...users.map((u) => ({
          id: `user-${u.id}`,
          type: "user",
          label: u.name || u.username || "User",
          subLabel: u.username,
          icon: "person",
          group: "People",
          url: `/profile/${u.username}`
        }))
      ];
      return { results };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Search failed" });
    }
  });
}

// backend/routes/index.ts
async function routes(fastify) {
  fastify.get("/", async () => {
    return { status: "ok", message: "TrackCodex Backend API v2 (Prisma)" };
  });
  fastify.get("/chat", { websocket: true }, (connection, req) => {
    ChatService.handleConnection(connection, req);
  });
  await fastify.register(authRoutes);
  await fastify.register(authOtpRoutes);
  await fastify.register(notificationRoutes);
  await fastify.register(workspaceRoutes);
  await fastify.register(repositoryRoutes);
  await fastify.register(jobRoutes);
  await fastify.register(orgRoutes);
  await fastify.register(communityRoutes);
  await fastify.register(profileRoutes);
  await fastify.register(forgeRoutes);
  await fastify.register(adminRoutes);
  await fastify.register(searchRoutes);
}

// backend/server.ts
import { PrismaClient as PrismaClient18 } from "@prisma/client";

// backend/middleware/csrf.ts
async function csrfProtection(request, reply) {
  if (isCsrfExempt(request.url)) {
    return;
  }
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    return;
  }
  console.log("[CSRF Debug] Method:", request.method, "Path:", request.url);
  console.log("[CSRF Debug] Origin:", request.headers.origin);
  console.log("[CSRF Debug] Cookies:", JSON.stringify(request.cookies));
  console.log("[CSRF Debug] Headers:", Object.keys(request.headers));
  const sessionId = request.cookies?.session_id;
  if (!sessionId) {
    console.warn("[CSRF Failure] No session_id in cookie");
    return reply.code(401).send({
      error: "Unauthorized",
      message: "No session found - Cookie missing"
    });
  }
  const csrfToken = request.headers["x-csrf-token"];
  if (!csrfToken) {
    return reply.code(403).send({
      error: "Forbidden",
      message: "CSRF token required"
    });
  }
  const isValid = await validateCsrfToken(sessionId, csrfToken);
  if (!isValid) {
    return reply.code(403).send({
      error: "Forbidden",
      message: "Invalid CSRF token"
    });
  }
}
var csrfExemptPaths = [
  "/api/v1/auth/google",
  "/api/v1/auth/github",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/webhooks/"
];
function isCsrfExempt(path4) {
  return csrfExemptPaths.some((exemptPath) => path4.startsWith(exemptPath));
}

// backend/server.ts
var server = Fastify({
  logger: true,
  // Trust proxy for correct IP detection behind load balancers/reverse proxies
  trustProxy: true
});
var prisma18 = new PrismaClient18();
async function bootstrap() {
  await server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        // Adjust for React/Vite
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "http://localhost:3000",
          "ws://localhost:4000",
          "http://localhost:4000"
        ]
      }
    },
    global: true
  });
  await server.register(cookie, {
    secret: process4.env.COOKIE_SECRET || "fallback-secret-change-in-prod-min-32-chars",
    parseOptions: {}
  });
  await server.register(cors, {
    origin: [
      process4.env.FRONTEND_URL || "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
    // Required for HttpOnly cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "x-user-id"
    ],
    maxAge: 86400
    // cache preflight response for 24 hours
  });
  await server.register(rateLimit, {
    max: 100,
    // Default limit per IP
    timeWindow: "15 minutes",
    keyGenerator: rateLimitKeyGenerator,
    // Custom key generator using IP + UserID
    errorResponseBuilder: (req, context) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: "Global rate limit exceeded. Please slow down.",
      retryAfter: context.ttl
    })
  });
  server.addHook("preHandler", csrfProtection);
  await server.register(websocket);
  server.get("/", async (request, reply) => {
    if (request.headers["accept"]?.includes("text/html")) {
      return reply.redirect("http://localhost:3000");
    }
    return {
      status: "online",
      message: "TrackCodex Backend Server is running.",
      api_version: "v1",
      security: "enhanced"
    };
  });
  await server.register(routes, { prefix: "/api/v1" });
  server.setNotFoundHandler((request, reply) => {
    server.log.warn(`404 Encountered: ${request.method} ${request.url}`);
    reply.status(404).send({
      status: "404_NOT_FOUND",
      message: `Route ${request.method}:${request.url} is not registered on the TrackCodex Backend.`,
      available_endpoints: ["/", "/api/v1", "/api/v1/jobs"]
    });
  });
  try {
    await prisma18.$connect();
    console.log("\u2705 Connected to PostgreSQL database");
    const port = process4.env.PORT ? parseInt(process4.env.PORT) : 4e3;
    await server.listen({ port, host: "0.0.0.0" });
    console.log(
      `\u{1F680} TrackCodex Backend operational on port ${port} (Secure Mode)`
    );
  } catch (err) {
    server.log.error(err);
    await prisma18.$disconnect();
  }
}
bootstrap();
//# sourceMappingURL=index.js.map
