// Fix: Import process from 'process' to ensure the Node.js process object is correctly typed
import process from "process";
import { env } from "./config/env"; // Strict Env Validation

import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import { routes } from "./routes/index";
import { PrismaClient } from "@prisma/client";
import {
  rateLimitKeyGenerator,
  rateLimitErrorHandler,
} from "./middleware/rateLimit";
import { csrfProtection } from "./middleware/csrf";

const server = Fastify({
  logger: true,
  // Trust proxy for correct IP detection behind load balancers/reverse proxies
  trustProxy: true,
});

const prisma = new PrismaClient();

async function bootstrap() {
  // 1. Security Headers (Helmet) - First line of defense
  await server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust for React/Vite
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "http://localhost:3000",
          "ws://localhost:4000",
          "http://localhost:4000",
        ],
      },
    },
    global: true,
  });

  // 2. Cookie Parser - Essential for HttpOnly sessions
  await server.register(cookie, {
    secret:
      process.env.COOKIE_SECRET ||
      "fallback-secret-change-in-prod-min-32-chars",
    parseOptions: {},
  });

  // 3. CORS - Strict configuration with credentials support
  await server.register(cors, {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true, // Required for HttpOnly cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "x-user-id",
    ],
    maxAge: 86400, // cache preflight response for 24 hours
  });

  // 4. Rate Limiting - DDoS protection
  await server.register(rateLimit, {
    max: 100, // Default limit per IP
    timeWindow: "15 minutes",
    keyGenerator: rateLimitKeyGenerator, // Custom key generator using IP + UserID
    errorResponseBuilder: (req, context) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: "Global rate limit exceeded. Please slow down.",
      retryAfter: context.ttl,
    }),
  });

  // 5. CSRF Protection - Global middleware
  // Run on preHandler to ensure cookies are parsed
  server.addHook("preHandler", csrfProtection);

  // 6. WebSocket Support
  await server.register(websocket);

  // Root Health Check
  server.get("/", async (request, reply) => {
    // If browser request, redirect to frontend
    if (request.headers["accept"]?.includes("text/html")) {
      return reply.redirect("http://localhost:3000");
    }
    return {
      status: "online",
      message: "TrackCodex Backend Server is running.",
      api_version: "v1",
      security: "enhanced",
    };
  });

  // Register API Routes
  await server.register(routes, { prefix: "/api/v1" });

  // Custom 404 for debugging
  server.setNotFoundHandler((request, reply) => {
    server.log.warn(`404 Encountered: ${request.method} ${request.url}`);
    reply.status(404).send({
      status: "404_NOT_FOUND",
      message: `Route ${request.method}:${request.url} is not registered on the TrackCodex Backend.`,
      available_endpoints: ["/", "/api/v1", "/api/v1/jobs"],
    });
  });

  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database");

    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await server.listen({ port, host: "0.0.0.0" });
    console.log(
      `🚀 TrackCodex Backend operational on port ${port} (Secure Mode)`,
    );
  } catch (err) {
    server.log.error(err);
    await prisma.$disconnect();
  }
}

bootstrap();
