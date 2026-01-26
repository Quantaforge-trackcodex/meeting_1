import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { authOtpRoutes } from './auth_otp';
import { workspaceRoutes } from './workspaces';
import { repositoryRoutes } from './repositories';
import { jobRoutes } from './jobs';
import { orgRoutes } from './organizations';
import { communityRoutes } from './community';
import { profileRoutes } from './profile';
import { forgeRoutes } from './forge';
import { notificationRoutes } from './notifications';
import { adminRoutes } from './admin';
import { searchRoutes } from './search'; // Global Search
import { ChatService } from '../services/chat';



export async function routes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return { status: 'ok', message: 'TrackCodex Backend API v2 (Prisma)' };
    });

    // Chat WebSocket
    fastify.get('/chat', { websocket: true }, (connection, req) => {
        ChatService.handleConnection(connection, req);
    });

    await fastify.register(authRoutes);
    await fastify.register(authOtpRoutes);
    await fastify.register(notificationRoutes); // NEW
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
