import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userId = JSON.parse(
        event.node.req.headers['x-user-id'] as string
    )

    const documents = await prisma.document.findMany({
        where: {
            userId: userId
        }
    })

    return documents || []

})