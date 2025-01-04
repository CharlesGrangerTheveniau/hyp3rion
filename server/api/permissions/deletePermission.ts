import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    await prisma.permission.delete({
        where: {
            id: body.permissionId,
        },
    })
}) 