import type { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await getAddress(event)
    /* case 'POST':
      return await createAddress(event)
    case 'PATCH':
      return await patchAddress(event)
    case 'DELETE':
      return await deleteAddress(event) */
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
})

// ------------------------------------------------------------

export const getAddress = async (event: H3Event) => {
    const addressId = JSON.parse(
        event.node.req.headers['x-address-id'] as string
    )

    if (!addressId) {
        throw new Error('Address ID is required')
    }

    const address = await prisma.address.findUnique({
        where: {
            id: addressId
        }
    })

    if (!address) {
        throw new Error('Address not found')
    }

    return {
        id: address.id,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        zip: address.zip,
        country: address.country
    }

}

export interface Address {
    id: string
    line1: string
    line2: string | null
    city: string
    zip: string
    country: string
}
