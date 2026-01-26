/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

import { FastifyRequest, FastifyReply } from "fastify";
import { validateCsrfToken } from "../services/session";

/**
 * CSRF middleware - validates CSRF tokens on state-changing requests
 */
export async function csrfProtection(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Skip if path is exempt
  if (isCsrfExempt(request.url)) {
    return;
  }

  // Only check CSRF on state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    return;
  }

  // Debug logging for Session/CSRF investigation
  console.log("[CSRF Debug] Method:", request.method, "Path:", request.url);
  console.log("[CSRF Debug] Origin:", request.headers.origin);
  console.log("[CSRF Debug] Cookies:", JSON.stringify(request.cookies));
  console.log("[CSRF Debug] Headers:", Object.keys(request.headers));

  // Get session ID from cookie
  const sessionId = request.cookies?.session_id;
  if (!sessionId) {
    console.warn("[CSRF Failure] No session_id in cookie");
    return reply.code(401).send({
      error: "Unauthorized",
      message: "No session found - Cookie missing",
    });
  }

  // Get CSRF token from header
  const csrfToken = request.headers["x-csrf-token"] as string;
  if (!csrfToken) {
    return reply.code(403).send({
      error: "Forbidden",
      message: "CSRF token required",
    });
  }

  // Validate token
  const isValid = await validateCsrfToken(sessionId, csrfToken);
  if (!isValid) {
    return reply.code(403).send({
      error: "Forbidden",
      message: "Invalid CSRF token",
    });
  }
}

/**
 * Generate and return CSRF token in response
 */
export function attachCsrfToken(request: FastifyRequest, reply: FastifyReply) {
  const csrfToken = (request as any).csrfToken;
  if (csrfToken) {
    reply.header("X-CSRF-Token", csrfToken);
  }
}

/**
 * CSRF exempt routes (OAuth callbacks, webhooks, etc.)
 */
export const csrfExemptPaths = [
  "/api/v1/auth/google",
  "/api/v1/auth/github",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/webhooks/",
];

/**
 * Check if path is exempt from CSRF
 */
export function isCsrfExempt(path: string): boolean {
  return csrfExemptPaths.some((exemptPath) => path.startsWith(exemptPath));
}
