import { PrismaClient } from "@prisma/client"
import type { EntityMetadata, CompanyMetadata, PersonMetadata } from "../types"
import { EntityType } from "../types"
export class EntityService {
    private static prisma = new PrismaClient()

    static async getEntityById(id: string): Promise<EntityMetadata | null> {
        return await this.prisma.entity.findUnique({
            where: {
                id
            }
        })
    }

    async buildLegalEntity(entity: EntityMetadata): Promise<PersonMetadata | CompanyMetadata | undefined> {
        if (entity.type === EntityType.PERSON) {
            return await EntityService.buildPerson(entity.id)
        } else if (entity.type === EntityType.COMPANY) {
            return await EntityService.buildCompany(entity.id)
        } else {
            return undefined
        }
    }

    static async buildPerson(entityId: string): Promise<PersonMetadata> {
        const person = await this.prisma.person.findUnique({
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

    static async buildCompany(entityId: string): Promise<CompanyMetadata> {
        const company = await this.prisma.company.findUnique({
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
}