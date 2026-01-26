import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In-memory cache for heatmaps
const heatmapCache = new Map<string, { data: any, timestamp: number }>();
const HEATMAP_TTL = 60000; // 1 minute

export async function profileRoutes(fastify: FastifyInstance) {

    // Get Full Profile
    fastify.get('/profile/:username', async (request, reply) => {
        const { username } = request.params as any;

        // Find User
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                profile: { include: { socialLinks: true } },
                relations: false // skipping for brevity
            }
        });

        if (!user) return reply.code(404).send({ message: 'User not found' });

        // Fetch Freelancer Stats (Separate query usually better)
        const freelancerProfile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id },
            include: { reviews: true }
        });

        return {
            user,
            freelancerProfile
        };
    });

    // exact GitHub-parity Heatmap API
    fastify.get('/profile/:username/contributions', async (request, reply) => {
        const { username } = request.params as any;

        const now = Date.now();
        const cached = heatmapCache.get(username);
        if (cached && (now - cached.timestamp < HEATMAP_TTL)) {
            console.log(`[Cache] Serving heatmap for ${username}`);
            return cached.data;
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return reply.code(404).send({ message: 'User not found' });

        // Fetch pre-aggregated data
        const dailyData = await prisma.dailyContribution.findMany({
            where: { userId: user.id },
            orderBy: { date: 'asc' }
        });

        const total = dailyData.reduce((acc, curr) => acc + curr.count, 0);

        // Determine date range (one year)
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setFullYear(fromDate.getFullYear() - 1);

        const result = {
            total_contributions: total,
            from: fromDate.toISOString().split('T')[0],
            to: toDate.toISOString().split('T')[0],
            contributions: dailyData.map(d => ({
                date: d.date,
                count: d.count,
                level: d.level
            }))
        };

        heatmapCache.set(username, { data: result, timestamp: now });
        return result;
    });

    // Get Activity Heatmap Data
    fastify.get('/profile/:username/heatmap', async (request, reply) => {
        const { username } = request.params as any;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return reply.code(404).send({ message: 'User not found' });

        // Aggregate counts by day (Postgres-specific or manual grouping)
        // For MVP, fetch all logs for last year and map in JS (Not optimal for huge scale, fine for initial version)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const logs = await prisma.activityLog.findMany({
            where: {
                userId: user.id,
                createdAt: { gte: oneYearAgo }
            },
            select: { createdAt: true, action: true }
        });

        // Grouping logic return
        return { logs, total: logs.length };
    });

    // Get AI Usage Analytics
    fastify.get('/profile/:username/ai-usage', async (request, reply) => {
        const { username } = request.params as any;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return reply.code(404).send({ message: 'User not found' });

        const logs = await prisma.aIUsageLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit for now
        });

        // Calculate totals
        const totalTokens = await prisma.aIUsageLog.aggregate({
            where: { userId: user.id },
            _sum: { tokensUsed: true }
        });

        return { logs, totalTokens: totalTokens._sum.tokensUsed || 0 };
    });

    // Real-time Activity Logger
    fastify.post('/profile/activity', async (request, reply) => {
        const { username, action, metadata } = request.body as any;

        // 1. Get User
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            // For prototype without full auth flow, we might auto-create or error
            // Let's assume user exists or use the first one fallback
            const firstUser = await prisma.user.findFirst();
            if (!firstUser) return reply.code(400).send({ message: 'No users found' });
            // Use first user if specific one not found (Demo resilience)
            var userId = firstUser.id;
        } else {
            var userId = user.id;
        }

        // 2. Log Activity
        await prisma.activityLog.create({
            data: {
                userId,
                action,
                metadata: metadata || {}
            }
        });

        // 3. Update Daily Aggregation
        const today = new Date().toISOString().split('T')[0];

        const daily = await prisma.dailyContribution.upsert({
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

        // 4. Update Level (Simple Logic: 1-5 actions=1, 6-10=2, 11-15=3, 15+=4)
        // In a real app, this would be relative to max, but for instant feedback:
        let newLevel = 1;
        if (daily.count >= 5) newLevel = 2;
        if (daily.count >= 10) newLevel = 3;
        if (daily.count >= 15) newLevel = 4;

        await prisma.dailyContribution.update({
            where: { id: daily.id },
            data: { level: newLevel }
        });

        return { success: true, count: daily.count };
    });

    // Updated SEED Endpoint
    fastify.post('/profile/seed-stats', async (request, reply) => {
        const { userId } = request.body as any;
        if (!userId) return reply.code(400).send({ message: 'UserId required' });

        // 1. Clear old data
        await prisma.dailyContribution.deleteMany({ where: { userId } });
        await prisma.activityLog.deleteMany({ where: { userId } });

        // 2. Generate activity
        const dailyMap: Record<string, number> = {};
        const now = new Date();

        const logs = [];
        for (let i = 0; i < 500; i++) {
            // Weighted random date
            const offset = Math.floor(Math.random() * 365);
            const date = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];

            logs.push({
                userId,
                action: 'commit',
                createdAt: date,
                metadata: {}
            });

            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
        }

        // Insert Logs
        await prisma.activityLog.createMany({ data: logs });

        // 3. Compute Levels & Insert Daily
        // Simple quartile logic: max count -> scale
        const maxCount = Math.max(...Object.values(dailyMap), 1);

        const contributions = Object.entries(dailyMap).map(([date, count]) => {
            let level = 0;
            if (count > 0) level = 1;
            if (count >= maxCount * 0.25) level = 2;
            if (count >= maxCount * 0.5) level = 3;
            if (count >= maxCount * 0.75) level = 4;

            return { userId, date, count, level };
        });

        await prisma.dailyContribution.createMany({ data: contributions });

        return { success: true, message: 'Seeded aggregated analytics' };
    });
}
