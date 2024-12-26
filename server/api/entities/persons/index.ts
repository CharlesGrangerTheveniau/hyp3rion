import type { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await getPerson(event)
    case 'POST':
      return await createPerson(event)
    case 'PATCH':
      return await patchPerson(event)
    case 'DELETE':
      return await deletePerson(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// ------------------------------------------------------------

export const getPerson = async (event: H3Event) => {
    const id = JSON.parse(
        event.node.req.headers['x-entity-id'] as string
    )

    const person = await prisma.person.findUnique({
        where: {
            entityId: id
        }
    })

    console.log(person)

    return person

}

// ------------------------------------------------------------

export const patchPerson = async (event: H3Event) => {
    const id = JSON.parse(
        event.node.req.headers['x-entity-id'] as string
    )

    const body = await readBody(event)

    const person = await prisma.person.update({
        where: {
            entityId: id
        },
        data: {
            ...body
        }
    })

    console.log(person)

    return person

}

// ------------------------------------------------------------

export const deletePerson = async (event: H3Event) => {
    const id = JSON.parse(
        event.node.req.headers['x-entity-id'] as string
    )

    const person = await prisma.person.delete({
        where: {
            entityId: id
        }
    })

    return person
}

// ------------------------------------------------------------

export const createPerson = async (event: H3Event) => {
    const body = await readBody(event)

    const person = await prisma.person.create({
        data: body
    })

    return person
}