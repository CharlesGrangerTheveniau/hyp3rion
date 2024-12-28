import { PrismaClient, EntityType } from "@prisma/client"
import type { ClientMetadata, Client, PersonMetadata, CompanyMetadata } from "../types"
import { EntityService } from "./entityService"


export class ClientService {
    
    private prisma = new PrismaClient()
    private entityService = new EntityService()

    async buildClient(clientMetadata: ClientMetadata): Promise<Client | null> {

        const entity = await EntityService.getEntityById(clientMetadata.entityId)
        if (!entity) return null

        const legalEntity = await this.entityService.buildLegalEntity(entity)
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

    async  getClientById(clientId: string): Promise<ClientMetadata | null> {
        const client = await this.prisma.client.findUnique({
            where: {
                id: clientId
            }
        })
        return client
    }
}

