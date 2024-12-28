import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userSession = JSON.parse(
        event.node.req.headers['x-user-data'] as string
    )

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: userSession.email },
                { phone: userSession.phone }
            ]
        },
        include: {
            permissions: true,
        }
    })

    if (!user) {
        const newUser = await prisma.user.create({
            data: {
                email: userSession.email,
                phone: userSession.phone,
                firstName: userSession.user_metadata.firstName,
                lastName: userSession.user_metadata.lastName,
                fullName: userSession.user_metadata.fullName,
                avatar: userSession.user_metadata.avatar_url,
                connected: false
            }
        })
        return newUser
    }

    return user
})