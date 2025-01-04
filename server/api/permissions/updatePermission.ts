import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    console.log(body)

    const permission = await prisma.permission.update({
        where: {
            id: body.permissionId,
        },
        data: {
            permission: body.permission
        }
    })

    return permission
}) 