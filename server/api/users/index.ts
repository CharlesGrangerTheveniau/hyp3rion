import type { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await getUser(event)
    case 'POST':
      return await createUser(event)
    case 'PATCH':
      return await patchUser(event)
    /* case 'DELETE':
      return await handleDeleteUser(event) */
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

export const createUser = async (event: H3Event) => {
    const body = await readBody(event)
    const userSession = JSON.parse(
        event.node.req.headers['x-user-data'] as string
    )

    const newUser = await prisma.user.create({
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            fullName: userSession.full_name || `${body.firstName} ${body.lastName}`,
            email: userSession.email,
            avatarUrl: userSession.avatar_url || '',
            connected: true
        }
    })

    return newUser
}


// ------------------------------------------------------------
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

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found'
        })
    }

    return user
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
        ...body
      }
    })
  
    return updatedUser
}