/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */

import { type Operation, PrismaClient, type User, type PermissionType, EntityType } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const userSession = JSON.parse(
        event.node.req.headers['x-user-data'] as string
    )

    const user = await prisma.user.findUnique({
        where: {
            email: userSession.email
        },
        include: {
            permissions: true,
        }
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found'
        })
    }

    if (!user?.permissions) {
        throw createError({
            statusCode: 403,
            message: 'No permissions found for this user'
        })
    }
    const firmPermissions = await Promise.all(user.permissions
        .filter(p => p.firmId)
        .map(async (p) => {
            const firm = await buildFirm(p.firmId!)
            return firm
        })
    )

    console.log('firmPermissions', firmPermissions)

    const clientPermissions = await Promise.all(user.permissions
        .filter(p => p.clientId)
        .map(async (p) => {
            const client = await buildClient(p.clientId!)
            return client
        })
    )

    return { 
        firmPermissions,
        clientPermissions,
        user: user
    }

})

export interface EntityMetadata {
    id: string
    createdAt: Date
    updatedAt: Date
    type: EntityType
    clientId: string | null
    firmId: string | null
    role: string | null
}

async function getEntityById(id: string): Promise<EntityMetadata | null> {
    const entity = await prisma.entity.findUnique({
        where: {
            id
        }
    })
    return entity
}

export interface Client {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    firmId: string
    person?: PersonMetadata
    company?: CompanyMetadata
}

export interface ClientMetadata {
    id: string
    entityId: string
    createdAt: Date
    updatedAt: Date
    firmId: string
    name: string
}

async function getClientById(clientId: string): Promise<ClientMetadata | null> {
    const client = await prisma.client.findUnique({
        where: {
            id: clientId
        }
    })
    return client
}

async function buildClient(clientId: string): Promise<Client | null> {
    const clientMetadata = await getClientById(clientId)
    if (!clientMetadata) return null

    const entity = await getEntityById(clientMetadata.entityId)
    if (!entity) return null

    const legalEntity = await buildLegalEntity(entity)
    if (!legalEntity) return null

    const client: Client = {
        id: clientMetadata.id,
        name: clientMetadata.name,
        createdAt: clientMetadata.createdAt,
        updatedAt: clientMetadata.updatedAt,
        firmId: clientMetadata.firmId,
    }

    if (entity.type === EntityType.PERSON) {
        client['person'] = legalEntity as PersonMetadata
    } else if (entity.type === EntityType.COMPANY) {
        client['company'] = legalEntity as CompanyMetadata
    }

    return client
}

export interface Firm {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    status: 'CERTIFIED' | 'UNCERTIFIED',
    //clients: Client[]
    /* permissions: Permission[] | null
    operations: Operation[] */
    person?: PersonMetadata
    company?: CompanyMetadata
}

export interface FirmMetadata {
    id: string
    entityId: string | null
    name: string
    createdAt: Date
    updatedAt: Date
    status: 'CERTIFIED' | 'UNCERTIFIED'
}

async function getFirmById(firmId: string): Promise<FirmMetadata | null> {
    const firm = await prisma.firm.findUnique({
        where: {
            id: firmId
        }
    })
    return firm
}

async function buildFirm(firmId: string): Promise<Firm | null> {

    
    const firmMetadata = await getFirmById(firmId)
    if (!firmMetadata) return null

    const entity = await getEntityById(firmMetadata.entityId ?? '')
    if (!entity) return null

    const legalEntity = await buildLegalEntity(entity)
    if (!legalEntity) return null

    const firm: Firm = {
        id: firmMetadata.id,
        name: firmMetadata.name,
        createdAt: firmMetadata.createdAt,
        updatedAt: firmMetadata.updatedAt,
        status: firmMetadata.status,
        /* clients: [],
        permissions: await getPermissionsByAuthorityId(firmMetadata.id, 'firm'),
        operations: [], */
    }

    if (entity.type === EntityType.PERSON) {
        firm['person'] = legalEntity as PersonMetadata
    } else if (entity.type === EntityType.COMPANY) {
        firm['company'] = legalEntity as CompanyMetadata
    }

    return firm

}

async function buildLegalEntity(entity: EntityMetadata): Promise<PersonMetadata | CompanyMetadata | undefined> {
    if (entity.type === EntityType.PERSON) {
        return await buildPerson(entity.id)
    } else if (entity.type === EntityType.COMPANY) {
        return await buildCompany(entity.id)
    } else {
        return undefined
    }
}

async function buildPerson(entityId: string): Promise<PersonMetadata> {
    const person = await prisma.person.findUnique({
        where: {
            entityId
        }
    })

    return {
        id: person?.id ?? '',
        entityId: person?.entityId ?? '',
        firstName: person?.firstName ?? '',
        lastName: person?.lastName ?? '',
        email: person?.email ?? null,
        phone: person?.phone ?? null,
        birthDate: person?.birthDate ?? null,
        birthPlace: person?.birthPlace ?? null,
        nationality: person?.nationality ?? null,
        gender: person?.gender ?? null,
        createdAt: person?.createdAt ?? new Date(),
        updatedAt: person?.updatedAt ?? new Date()
    }
}

async function buildCompany(entityId: string): Promise<CompanyMetadata> {
    const company = await prisma.company.findUnique({
        where: {
            entityId
        }
    })

    return {
        id: company?.id ?? '',
        entityId: company?.entityId ?? '',
        name: company?.name ?? '',
        createdAt: company?.createdAt ?? new Date(),
        updatedAt: company?.updatedAt ?? new Date(),
        siren: company?.siren ?? undefined,
        type: company?.type ?? undefined,
        address: company?.address ?? undefined,
        capital: company?.capital ?? undefined
    }
}

export interface PersonMetadata {
    id: string
    entityId: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    birthDate?: Date | null
    birthPlace?: string | null
    nationality?: string | null
    gender?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface CompanyMetadata {
    id: string
    entityId: string
    name: string
    siren?: string
    type?: string
    address?: string
    capital?: number
    createdAt: Date
    updatedAt: Date
}
