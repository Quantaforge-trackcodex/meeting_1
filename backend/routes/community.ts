import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function communityRoutes(fastify: FastifyInstance) {

    // List Posts
    fastify.get('/community/posts', async (request, reply) => {
        const posts = await prisma.communityPost.findMany({
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                comments: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return posts;
    });

    // Create Post
    fastify.post('/community/posts', async (request, reply) => {
        const { title, content, authorId } = request.body as any;

        if (!authorId) return reply.code(400).send({ message: 'Author ID required' });

        const post = await prisma.communityPost.create({
            data: {
                title,
                content,
                authorId
            }
        });

        return post;
    });

    // Add Comment
    fastify.post('/community/posts/:id/comments', async (request, reply) => {
        const { id } = request.params as any;
        const { text, authorId } = request.body as any;

        const comment = await prisma.communityComment.create({
            data: {
                postId: id,
                text,
                authorId
            }
        });

        return comment;
    });
}
