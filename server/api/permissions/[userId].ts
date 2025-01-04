import { PermissionType, PrismaClient } from "@prisma/client"
import { ClientService } from "~~/server/services/clientService"
import { FirmService } from "~~/server/services/firmService"


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const firmService = new FirmService()
    const clientService = new ClientService()

    const userId = event.context.params?.userId
    const permissions = await prisma.permission.findMany({
        where: {
            userId: userId
        },
        include: {
            firm: true,
            client: true
        }
    })

    // Await all promises for firm permissions
    const firmPermissions = await Promise.all(
        permissions
            .filter(p => p.permission !== PermissionType.DENIED)
            .filter(permission => permission.firm !== null)
            .map(async permission => {
                const firm = permission.firm
                return firm ? { type: 'firm',permissionForUser: permission.permission, ...await firmService.buildFirm(firm) } : null
            })
    )

    // Await all promises for client permissions
    const clientPermissions = await Promise.all(
        permissions
            .filter(p => p.permission !== PermissionType.DENIED)
            .filter(permission => permission.client !== null)
            .map(async permission => {
                const client = permission.client
                return client ? { type: 'client',permissionForUser: permission.permission, ...await clientService.buildClient(client) } : null
            })
    )

    return { firmPermissions, clientPermissions }
})  