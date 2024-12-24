import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userSession = JSON.parse(
        event.node.req.headers['x-user-data'] as string
    )

    const user = await prisma.user.findUnique({
        where: {
            id: userSession.id
        }
    })

    if (user) {
        console.log('user found',user)
        return user
    }

    const newUser = await prisma.user.create({
        data: {
            id: userSession.id,
            firstName: userSession.user_metadata.first_name || '',
            lastName: userSession.user_metadata.last_name || '',
            fullName: userSession.user_metadata.full_name || '',
            email: userSession.email
        }
    })

    return newUser
})