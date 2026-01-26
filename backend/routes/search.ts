
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();

export async function searchRoutes(fastify: FastifyInstance) {

    // Global Search Endpoint
    // GET /api/v1/search?q=query
    fastify.get('/search', { preHandler: requireAuth }, async (request, reply) => {
        const { q } = request.query as { q: string };
        const user = (request as any).user;

        if (!q || q.length < 2) {
            return { results: [] };
        }

        const query = q.toLowerCase();

        try {
            // Search in parallel across main entities
            const [users, orgs, repos, workspaces, jobs] = await Promise.all([

                // 1. Users (People)
                prisma.user.findMany({
                    where: {
                        OR: [
                            { name: { contains: query } }, // Case insensitive in standard SQL, Prisma standard depends on DB
                            { username: { contains: query } },
                            { email: { contains: query } }
                        ]
                    },
                    take: 5,
                    select: { id: true, name: true, username: true, avatar: true }
                }),

                // 2. Organizations
                prisma.organization.findMany({
                    where: { name: { contains: query } },
                    take: 5,
                    select: { id: true, name: true }
                }),

                // 3. Repositories (Public or member of Org)
                // For simplicity: All public + explicit checks ideally
                prisma.repository.findMany({
                    where: {
                        OR: [
                            { name: { contains: query } },
                            { description: { contains: query } }
                        ],
                        // isPublic: true // Assume public for search scope in this demo
                    },
                    take: 5,
                    select: { id: true, name: true, description: true }
                }),

                // 4. Workspaces (Owned by user)
                prisma.workspace.findMany({
                    where: {
                        ownerId: user.userId,
                        name: { contains: query }
                    },
                    take: 5,
                    select: { id: true, name: true, status: true }
                }),

                // 5. Jobs
                prisma.job.findMany({
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

            // Format results for CommandPalette
            const results = [
                ...orgs.map(o => ({
                    id: `org-${o.id}`,
                    type: 'org',
                    label: o.name,
                    icon: 'domain',
                    group: 'Organizations',
                    url: `/org/${o.id}`
                })),
                ...repos.map(r => ({
                    id: `repo-${r.id}`,
                    type: 'repo',
                    label: r.name,
                    subLabel: r.description,
                    icon: 'book',
                    group: 'Repositories',
                    url: `/repo/${r.id}`
                })),
                ...workspaces.map(w => ({
                    id: `ws-${w.id}`,
                    type: 'workspace',
                    label: w.name,
                    subLabel: w.status,
                    icon: 'terminal',
                    group: 'Workspaces',
                    url: `/workspace/${w.id}`
                })),
                ...jobs.map(j => ({
                    id: `job-${j.id}`,
                    type: 'job',
                    label: j.title,
                    subLabel: `${j.type} - ${j.budget}`,
                    icon: 'work',
                    group: 'Jobs',
                    url: `/jobs/${j.id}`
                })),
                ...users.map(u => ({
                    id: `user-${u.id}`,
                    type: 'user',
                    label: u.name || u.username || 'User',
                    subLabel: u.username,
                    icon: 'person',
                    group: 'People',
                    url: `/profile/${u.username}`
                }))
            ];

            return { results };

        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Search failed' });
        }
    });
}
