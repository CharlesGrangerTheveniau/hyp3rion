/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create users first
  const user1 = await prisma.user.create({
    data: {
      email: 'partner@lawfirm1.fr',
      firstName: 'Thomas',
      lastName: 'Dubois',
      fullName: 'Thomas Dubois'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'partner@lawfirm2.fr',
      firstName: 'Sophie',
      lastName: 'Martin',
      fullName: 'Sophie Martin'
    }
  })

  // Create entities first (they're referenced by both firms and clients)
  const firmEntity1 = await prisma.entity.create({
    data: {
      type: 'COMPANY',
      company: {
        create: {
          name: 'Dubois & Associates',
          siren: '123456789',
          type: 'SCP',
          address: '123 Legal Street, 75008 Paris',
          capital: 100000
        }
      }
    }
  })

  const firmEntity2 = await prisma.entity.create({
    data: {
      type: 'COMPANY',
      company: {
        create: {
          name: 'Martin Legal Solutions',
          siren: '987654321',
          type: 'SELARL',
          address: '456 Avocat Avenue, 69002 Lyon',
          capital: 50000
        }
      }
    }
  })

  // Create firms
  const firm1 = await prisma.firm.create({
    data: {
      name: 'Dubois & Associates',
      entityId: firmEntity1.id,
      status: 'CERTIFIED',
      permissions: {
        create: {
          userId: user1.id,
          permission: 'ADMIN'
        }
      }
    }
  })

  const firm2 = await prisma.firm.create({
    data: {
      name: 'Martin Legal Solutions',
      entityId: firmEntity2.id,
      status: 'CERTIFIED',
      permissions: {
        create: {
          userId: user2.id,
          permission: 'ADMIN'
        }
      }
    }
  })

  // Create client entities
  const clientEntity1 = await prisma.entity.create({
    data: {
      type: 'COMPANY',
      company: {
        create: {
          name: 'TechCorp SAS',
          siren: '456789123',
          type: 'SAS',
          address: '789 Innovation Blvd, 75002 Paris',
          capital: 250000
        }
      }
    }
  })

  const clientEntity2 = await prisma.entity.create({
    data: {
      type: 'COMPANY',
      company: {
        create: {
          name: 'IndustrieGroup SARL',
          siren: '654321987',
          type: 'SARL',
          address: '321 Manufacturing Road, 69003 Lyon',
          capital: 100000
        }
      }
    }
  })

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      name: 'TechCorp SAS',
      entityId: clientEntity1.id,
      firmId: firm1.id,
      permissions: {
        create: {
          userId: user1.id,
          permission: 'ADMIN'
        }
      }
    }
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'IndustrieGroup SARL',
      entityId: clientEntity2.id,
      firmId: firm2.id,
      permissions: {
        create: {
          userId: user2.id,
          permission: 'ADMIN'
        }
      }
    }
  })

  // Create an operation for each client
  const operation1 = await prisma.operation.create({
    data: {
      clientId: client1.id,
      type: 'CREATION',
      status: 'PENDING',
      metadata: {
        description: 'Initial company setup',
        startDate: new Date().toISOString()
      }
    }
  })

  const operation2 = await prisma.operation.create({
    data: {
      clientId: client2.id,
      type: 'MODIFICATION',
      status: 'COMPLETED',
      metadata: {
        description: 'Company restructuring',
        startDate: new Date().toISOString()
      }
    }
  })

  // Create documents linked to operations
  const document1 = await prisma.document.create({
    data: {
      name: 'Corporate Restructuring Agreement',
      operationId: operation1.id,
      clientId: client1.id,
      type: 'CONTRACT',
      status: 'DRAFT',
      metadata: {
        version: '1.0',
        language: 'FR',
        documentType: 'CORPORATE_RESTRUCTURING'
      },
      signatories: {
        create: [
          {
            entityId: clientEntity1.id,
            name: 'TechCorp Representative',
            role: 'CLIENT'
          },
          {
            entityId: firmEntity1.id,
            name: 'Dubois & Associates Representative',
            role: 'DIRECTOR'
          }
        ]
      }
    }
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
