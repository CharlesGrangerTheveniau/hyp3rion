import { PermissionType, PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    console.log('body', body)

    const existingPermission = await prisma.permission.findFirst({
        where: {
            userId: body.userId,
            firmId: body.authorityType === 'firm' ? body.authorityId : null,
            clientId: body.authorityType === 'client' ? body.authorityId : null
        }
    })

    if (existingPermission) {
        console.log('patching permission to pending')
        const updatedPermission = await prisma.permission.update({
            where: {
                id: existingPermission.id
            },
            data: {
                permission: PermissionType.PENDING
            }
        })
        return updatedPermission
    }
    
    console.log('creating permission')
    const permission = await prisma.permission.create({
        data: {
            userId: body.userId,
            firmId: body.authorityType === 'firm' ? body.authorityId : null,
            clientId: body.authorityType === 'client' ? body.authorityId : null,
            permission: PermissionType.PENDING
        }
    })

    return permission
})