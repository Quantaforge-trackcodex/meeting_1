import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function repositoryRoutes(fastify: FastifyInstance) {

    // List Repositories
    fastify.get('/repositories', async (request, reply) => {
        const repositories = await prisma.repository.findMany({
            include: {
                org: true,
                securityAlerts: true // Include alerts summary
            }
        });
        return repositories;
    });

    // Get Repository Details
    fastify.get('/repositories/:id', async (request, reply) => {
        const { id } = request.params as any;
        const repo = await prisma.repository.findUnique({
            where: { id },
            include: {
                org: true,
                securityAlerts: true,
                aiTasks: true // Include AI tasks history
            }
        });

        if (!repo) return reply.code(404).send({ message: 'Repository not found' });
        return repo;
    });

    // Create Repository
    fastify.post('/repositories', async (request, reply) => {
        const { name, description, isPublic, techStack, orgId } = request.body as any;

        const repo = await prisma.repository.create({
            data: {
                name,
                description,
                isPublic: isPublic || false,
                language: techStack, // Mapping techStack to language for simplicity in this model
                orgId: orgId, // Optional link to org
                stars: 0,
                forks: 0
            }
        });

        return repo;
    });

    // Analyze Repository (AI Stub)
    fastify.post('/repositories/:id/analyze', async (request, reply) => {
        const { id } = request.params as any;

        // In a real app, this would trigger an async AI job
        const task = await prisma.aITask.create({
            data: {
                repoId: id,
                taskName: 'Code Quality Analysis',
                model: 'DeepSeek-r1',
                status: 'Processing',
                result: null
            }
        });

        return { message: 'Analysis started', taskId: task.id };
    });
}
