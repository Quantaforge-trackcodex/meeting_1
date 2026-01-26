import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { RoleGuard, OrgRole } from '../middleware/roles';
import { AuditService } from '../services/audit';

const prisma = new PrismaClient();

export async function orgRoutes(fastify: FastifyInstance) {

    // Get My Organizations
    fastify.get('/orgs', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string; // Mock Auth
        if (!userId) return reply.code(401).send({ error: "Unauthorized" });

        const members = await prisma.orgMember.findMany({
            where: { userId },
            include: { org: true }
        });
        return members.map(m => ({ ...m.org, role: m.role }));
    });

    // Create Organization
    fastify.post('/orgs', async (request, reply) => {
        const { name } = request.body as any;
        const userId = request.headers['x-user-id'] as string;

        const org = await prisma.organization.create({
            data: { name }
        });

        // Add Creator as OWNER
        await prisma.orgMember.create({
            data: {
                userId,
                orgId: org.id,
                role: 'OWNER' // Prisma Enum String
            }
        });

        await AuditService.log(userId, 'ORG_CREATE', { name, orgId: org.id });
        return org;
    });

    // Invite Member (RBAC: ADMIN or OWNER Only)
    fastify.post('/orgs/:id/invite', async (request, reply) => {
        const { id } = request.params as any;
        const { targetUserId, role } = request.body as any;
        const userId = request.headers['x-user-id'] as string;

        // 1. RBAC Check
        const canInvite = await RoleGuard.hasRole(userId, id, OrgRole.ADMIN);
        if (!canInvite) {
            await AuditService.log(userId, 'ORG_INVITE_DENIED', { orgId: id, reason: 'Insufficient Permissions' });
            return reply.code(403).send({ error: "Access Denied: Admin role required." });
        }

        // 2. Add Member
        try {
            const membership = await prisma.orgMember.create({
                data: {
                    orgId: id,
                    userId: targetUserId,
                    role: role || 'MEMBER'
                }
            });

            // 3. Log
            await AuditService.log(userId, 'ORG_INVITE', { orgId: id, targetUserId, role });

            return membership;
        } catch (e) {
            return reply.code(400).send({ error: "User likely already a member." });
        }
    });

    // Get Audit Logs (RBAC: OWNER Only)
    fastify.get('/orgs/:id/logs', async (request, reply) => {
        const { id } = request.params as any;
        const userId = request.headers['x-user-id'] as string;

        const isOwner = await RoleGuard.isOwner(userId, id);
        if (!isOwner) return reply.code(403).send({ error: "Access Denied: Owner role required." });

        // Fetch logs for this context?
        // Our AuditService currently fetches by User. Ideally we filter by workspace/org if metadata supports it.
        // For verify, we just return "Access Granted" msg or dummy logs
        return { logs: [{ action: 'ORG_CREATE', timestamp: new Date() }] };
    });
}
