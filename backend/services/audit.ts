import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditService {

    static async log(userId: string, action: string, metadata: any = {}, workspaceId?: string, orgId?: string) {
        try {
            await prisma.activityLog.create({
                data: {
                    userId,
                    action,
                    metadata: { ...metadata, orgId },
                    workspaceId,
                    createdAt: new Date()
                }
            });
            console.log(`\x1b[36m[AUDIT] ${userId} performed ${action}\x1b[0m`);
        } catch (e) {
            console.error("Failed to write audit log", e);
        }
    }

    static async getLogs(userId: string) {
        // Only fetch logs relevant to this user (or if admin, fetch all?)
        // For now, fetch user's own logs
        return prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }
}
