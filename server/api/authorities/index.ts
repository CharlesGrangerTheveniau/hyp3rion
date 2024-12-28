import { PrismaClient } from '@prisma/client'
import { ClientService } from '~~/server/services/clientService'
import { FirmService } from '~~/server/services/firmService'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const firmService = new FirmService()
    const clientService = new ClientService()
    const q = getQuery(event)

    console.log(`looking for authorities with ${q.q}`)

    const firms = await prisma.firm.findMany({
        where: {
            name: {
                contains: q.q as string,
                mode: 'insensitive'
            }
        }
    }).then(async firms => {
        return await Promise.all(firms.map(async firm => await firmService.buildFirm(firm)))
    })

    const clients = await prisma.client.findMany({
        where: {
            name: {
                contains: q.q as string,
                mode: 'insensitive'
            }
        }
    }).then(async clients => {
        return await Promise.all(clients.map(async client => await clientService.buildClient(client)))
    })

    return [...firms, ...clients]
    
})