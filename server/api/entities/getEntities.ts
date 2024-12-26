import { PrismaClient } from '@prisma/client'
import { getAddress } from '~/services/address-service'
import { getCompany, getPerson } from '~/services/entity-service'
import type { Address } from '../addresses'
import type { Company, Person } from '~/services/user-service'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userId = JSON.parse(
        event.node.req.headers['x-user-id'] as string
    )

    const entities = await prisma.entity.findMany({
        where: {
            userId: userId
        }
    })

    console.log(entities)

    return await Promise.all(entities.map(async (entity) => {
        return {
            id: entity.id,
            name: entity.type,
            address: entity.addressId ? await getAddress(entity.addressId) : null,
            type: entity.type,
            person: entity.type === 'PERSON' ? await getPerson(entity.id) : null,
            company: entity.type === 'COMPANY' ? await getCompany(entity.id) : null
        }
    })) || []

})

export interface Entity {
    id: string
    name: string
    address: Address | null
    type: string
    person: Person | null
    company: Company | null
}