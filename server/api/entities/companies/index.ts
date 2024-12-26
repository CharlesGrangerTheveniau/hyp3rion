import type { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await getCompany(event)
    case 'POST':
      return await createCompany(event)
    case 'PATCH':
      return await patchCompany(event)
    case 'DELETE':
      return await deleteCompany(event)
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// ------------------------------------------------------------

export const getCompany = async (event: H3Event) => {
    const id = JSON.parse(
        event.node.req.headers['x-entity-id'] as string
    )

    const company = await prisma.company.findUnique({
        where: {
            entityId: id
        }
    })

    console.log(company)

    return company

}

// ------------------------------------------------------------

export const patchCompany = async (event: H3Event) => {
    const id = JSON.parse(
        event.node.req.headers['x-entity-id'] as string
    )

    const body = await readBody(event)

    const company = await prisma.company.update({
        where: {
            entityId: id
        },
        data: {
            ...body
        }
    })

    console.log(company)

    return company

}

// ------------------------------------------------------------

export const deleteCompany = async (event: H3Event) => {
    const id = JSON.parse(
        event.node.req.headers['x-entity-id'] as string
    )

    const company = await prisma.company.delete({
        where: {
            entityId: id
        }
    })

    return company
}

// ------------------------------------------------------------

export const createCompany = async (event: H3Event) => {
    const body = await readBody(event)

    const company = await prisma.company.create({
        data: body
    })

    return company
}