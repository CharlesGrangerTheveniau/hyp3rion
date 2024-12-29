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
        const { fullName, firstName, lastName } = getNameFromUserSession(userSession)

        const newUser = await prisma.user.create({
            data: {
                email: userSession.email,
                phone: userSession.phone,
                firstName,
                lastName,
                fullName,
                avatar: userSession.user_metadata.avatar_url,
                connected: false
            }
        })
        return newUser
    }

    return user
})

function getNameFromUserSession(userSession: any) {

    if (userSession.user_metadata.full_name) {
        return { 
            fullName: userSession.user_metadata.full_name,
            firstName: userSession.user_metadata.full_name.split(' ')[0],
            lastName: userSession.user_metadata.full_name.split(' ')[1]
        }
    } else if (userSession.user_metadata.first_name && userSession.user_metadata.last_name) {
        return { 
            fullName: userSession.user_metadata.first_name + ' ' + userSession.user_metadata.last_name,
            firstName: userSession.user_metadata.first_name,
            lastName: userSession.user_metadata.last_name
        }
    }

    return {
        fullName: '',
        firstName: '',
        lastName: ''
    }
}