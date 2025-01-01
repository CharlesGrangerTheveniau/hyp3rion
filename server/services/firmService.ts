import { PrismaClient } from '@prisma/client'
import type { CompanyMetadata, Firm, FirmMetadata, PersonMetadata } from '../types'
import { EntityType } from '../types'
import { EntityService } from './entityService'



export class FirmService {

    private static prisma = new PrismaClient()
    private entityService = new EntityService()

    static async getFirmById(firmId: string): Promise<FirmMetadata | null> {
        return await this.prisma.firm.findUnique({
            where: { id: firmId }
        })
    }

    async buildFirm(firmMetadata: FirmMetadata): Promise<Firm | null> {
        const entity = await EntityService.getEntityById(firmMetadata.entityId ?? '')
        if (!entity) return null
        const legalEntity = await this.entityService.buildLegalEntity(entity)
        if (!legalEntity) return null
    
        const firm: Firm = {
            id: firmMetadata.id,
            name: firmMetadata.name,
            createdAt: firmMetadata.createdAt,
            updatedAt: firmMetadata.updatedAt,
            status: firmMetadata.status,
        }
    
        if (entity.type === EntityType.PERSON) {
            firm['person'] = legalEntity as PersonMetadata
        } else if (entity.type === EntityType.COMPANY) {
            firm['company'] = legalEntity as CompanyMetadata
        }
    
        return firm
    
    }
} 