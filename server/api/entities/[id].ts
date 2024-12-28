import type { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = getRouterParam(event, 'id')

  console.log('entity id:', id)

  /* switch (method) {
    case 'GET':
      return await getUser(event)
    
    case 'PATCH':
      return await patchUser(event)
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  } */
})

export const getUser = async (event: H3Event) => {
    const userSession = JSON.parse(
        event.node.req.headers['x-user-data'] as string
    )
    
    if (!userSession?.id) {
        throw createError({
            statusCode: 400,
            message: 'Invalid user session - missing ID'
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userSession.id
        }
    })

    if (user) {
        return user
    }

    const newUser = await prisma.user.create({
        data: {
            id: userSession.id,
            firstName: userSession.user_metadata.first_name || '',
            lastName: userSession.user_metadata.last_name || '',
            fullName: userSession.user_metadata.full_name || '',
            email: userSession.email,
            avatarUrl: userSession.user_metadata.avatar_url || ''
        }
    })

    return newUser
}

export interface UserProfile {
    id: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    phone: string
    avatarUrl: string | null
}



// ------------------------------

export const patchUser = async (event: H3Event) => {
    const body = await readBody(event)
    
    const userId = JSON.parse(
      event.node.req.headers['x-user-id'] as string
    )

    console.log('patchUser userId:', userId)
    console.log('patchUser body:', body)
  
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'Invalid user session'
      })
    }
  
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        avatarUrl: body.avatarUrl
      }
    })
  
    return updatedUser
}