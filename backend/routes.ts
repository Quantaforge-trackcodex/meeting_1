import { FastifyInstance } from 'fastify';
import { communityRoutes } from './routes/community';
import { applicationRoutes } from './routes/applications';

import { walletRoutes } from './routes/wallet';

export async function routes(fastify: FastifyInstance) {
  fastify.register(walletRoutes, { prefix: '/api/v1/wallet' });

  fastify.get('/', async () => {
    return { status: 'ok', message: 'TrackCodex Backend API v1' };
  });

  // Auth
  fastify.post('/auth/login', async (request, reply) => {
    return { token: 'dummy-token', user: { id: '1', name: 'Test User', email: 'test@example.com' } };
  });

  fastify.get('/auth/me', async (request, reply) => {
    return { id: '1', name: 'Test User', email: 'test@example.com', avatar: 'https://github.com/github.png' };
  });

  // Workspaces
  fastify.get('/workspaces', async () => {
    return [
      { id: '1', name: 'My Workspace', status: 'active', lastActive: new Date().toISOString() }
    ];
  });

  fastify.post('/workspaces', async (request) => {
    return { id: Math.random().toString(36).substr(2, 9), ...(request.body as any), status: 'creating' };
  });

  fastify.get('/workspaces/:id', async (request) => {
    const { id } = request.params as any;
    return { id, name: 'My Workspace', status: 'active', content: [] };
  });

  fastify.patch('/workspaces/:id/status', async (request) => {
    return { status: 'updated' };
  });

  // Repositories
  fastify.get('/repositories', async () => {
    return [
      { id: '1', name: 'trackcodex', description: 'Main repo', stars: 10, language: 'TypeScript' }
    ];
  });

  fastify.get('/repositories/:id', async (request) => {
    const { id } = request.params as any;
    return { id, name: 'trackcodex', description: 'Main repo', stars: 10, language: 'TypeScript' };
  });

  fastify.post('/repositories', async (request) => {
    return { id: Math.random().toString(36).substr(2, 9), ...(request.body as any) };
  });

  // ForgeAI
  fastify.post('/forgeai/complete', async (request) => {
    return { content: "I am a simulated AI response from the local backend." };
  });

  fastify.get('/forgeai/analyze/:id', async () => {
    return { analysis: "This repository seems well structured." };
  });

  // Jobs
  fastify.get('/jobs', async () => {
    return [];
  });

  fastify.post('/jobs', async (request) => {
    return { id: Math.random().toString(36).substr(2, 9), ...(request.body as any) };
  });

  fastify.post('/jobs/:id/apply', async () => {
    return { success: true };
  });

  // Profiles
  fastify.get('/profiles/:username', async (request) => {
    const { username } = request.params as any;
    return { username, name: 'Test User', bio: 'Developer' };
  });

  fastify.patch('/profiles/me', async (request) => {
    return { success: true, ...(request.body as any) };
  });
}
