import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const userSessionHeader = event.node.req.headers['x-user-data']
        if (!userSessionHeader) {
            throw createError({
                statusCode: 401,
                message: 'No user session provided'
            })
        }

        let userSession
        try {
            userSession = JSON.parse(userSessionHeader as string)
        } catch (e) {
            console.error('Failed to parse user session:', userSessionHeader)
            throw createError({
                statusCode: 400,
                message: 'Invalid user session format'
            })
        }

        // Log the user session to see what we're getting in production
        console.log('User Session:', userSession)

        const user = await prisma.user.findFirst({
            where: {
                email: userSession.email
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
    } catch (error) {
        // Log the full error in production
        console.error('WhoAmI Error:', error)
        
        throw createError({
            statusCode: 500,
            message: process.env.NODE_ENV === 'production' 
                ? 'Internal server error' 
                : error.message
        })
    }
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