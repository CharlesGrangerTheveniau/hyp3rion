/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create sample user
  const user1 = await prisma.user.create({
    data: {
      email: 'jean@techstartup.fr'
    }
  })

  // Create person entity
  const personEntity = await prisma.entity.create({
      data: {
      type: 'PERSON',
      userId: user1.id,
      person: {
        create: {
          firstName: 'Jean',
          lastName: 'Dupont',
          birthDate: new Date('1980-01-01'),
          birthPlace: 'Paris',
          address: '123 Residential St, 75003 Paris',
          nationality: 'French'
        }
      }
      }
    })

    // Create company entity
    const companyEntity = await prisma.entity.create({
      data: {
        type: 'COMPANY',
      userId: user1.id,
        company: {
          create: {
          name: 'Tech Startup SAS',
          address: '456 Innovation Ave, 75002 Paris',
            sirenNumber: '123456789',
          incorporationDate: new Date('2023-01-01'),
            incorporationPlace: 'Paris'
          }
        }
      }
    })

  // Create sample document
  const document1 = await prisma.document.create({
      data: {
      name: 'Non-Disclosure Agreement',
      jurisdiction: 'France',
      userId: user1.id,
        fromEntityId: companyEntity.id,
        toEntityId: personEntity.id,
      status: 'DRAFT',
      metadata: {
        version: '1.0',
        language: 'FR',
        documentType: 'NDA'
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
