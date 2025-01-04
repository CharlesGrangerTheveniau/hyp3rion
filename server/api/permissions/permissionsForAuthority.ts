import { PrismaClient } from "@prisma/client"
import type { PermissionWithUser, User } from "~~/server/types"

const prisma = new PrismaClient()

export default defineEventHandler(async (event): Promise<PermissionWithUser[]> => {

    const body = await readBody(event)

    const permissions = await prisma.permission.findMany({
        where: {
            OR: [
                { firmId: body.firmId },
                { clientId: body.clientId }
            ]
        },
        include: {
            user: true
        }
    })

    return permissions.map((permission) => ({
        id: permission.id,
        firmId: permission.firmId ?? null,
        clientId: permission.clientId ?? null,
        permission: permission.permission,
        userId: permission.userId,
        user: permission.user as unknown as User
    })) as PermissionWithUser[]
})  