import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function workspaceRoutes(fastify: FastifyInstance) {
  // List Workspaces
  fastify.get("/workspaces", async (request, reply) => {
    // In real app: use request.user.id to filter
    const workspaces = await prisma.workspace.findMany({
      include: { owner: true },
    });
    return workspaces;
  });

  // Create Workspace
  fastify.post("/workspaces", async (request, reply) => {
    const { name, description, ownerId } = request.body as any;

    // Fallback if no ownerId sent (demo mode)
    let finalOwnerId = ownerId;
    if (!finalOwnerId) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser)
        return reply
          .code(400)
          .send({ message: "No users exist. Register first." });
      finalOwnerId = firstUser.id;
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        ownerId: finalOwnerId,
        status: "Starting",
      },
    });

    return workspace;
  });

  // Get Workspace Details
  fastify.get("/workspaces/:id", async (request, reply) => {
    const { id } = request.params as any;
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: { owner: true },
    });
    return (
      workspace || reply.code(404).send({ message: "Workspace not found" })
    );
  });

  // Start Workspace IDE
  fastify.post("/workspaces/:id/start", async (request, reply) => {
    const { id } = request.params as any;

    // Ensure workspace exists first
    const workspace = await prisma.workspace.findUnique({ where: { id } });
    if (!workspace)
      return reply.code(404).send({ message: "Workspace not found" });

    try {
      // Lazy load to avoid circular deps if any, though separate files usually fine
      const { WorkspaceManager } = await import("../services/workspaceManager");
      const result = await WorkspaceManager.startWorkspace(id);

      // Update status
      await prisma.workspace.update({
        where: { id },
        data: { status: "Running" },
      });

      return result; // Returns { url: 'http://localhost:300X', port: 300X }
    } catch (error: any) {
      request.log.error(error);
      return reply
        .code(500)
        .send({
          message: "Failed to start workspace environment",
          error: error.message,
        });
    }
  });

  // Update Status
  fastify.patch("/workspaces/:id/status", async (request, reply) => {
    const { id } = request.params as any;
    const { status } = request.body as any;

    const workspace = await prisma.workspace.update({
      where: { id },
      data: { status },
    });

    return workspace;
  });
}
