/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'jean@techstartup.fr',
      firstName: 'Jean',
      lastName: 'Dupont'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'marie@consulting.fr',
      firstName: 'Marie',
      lastName: 'Laurent'
    }
  })

  // Create person entities
  const personEntity1 = await prisma.entity.create({
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
          nationality: 'French',
          email: 'jean@techstartup.fr',
          phone: '+33612345678'
        }
      }
    }
  })

  const personEntity2 = await prisma.entity.create({
    data: {
      type: 'PERSON',
      userId: user2.id,
      person: {
        create: {
          firstName: 'Marie',
          lastName: 'Laurent',
          birthDate: new Date('1985-05-15'),
          birthPlace: 'Lyon',
          address: '789 Business Ave, 69002 Lyon',
          nationality: 'French',
          email: 'marie@consulting.fr',
          phone: '+33687654321'
        }
      }
    }
  })

  // Create company entities
  const companyEntity1 = await prisma.entity.create({
    data: {
      type: 'COMPANY',
      userId: user1.id,
      company: {
        create: {
          name: 'Tech Startup SAS',
          address: '456 Innovation Ave, 75002 Paris',
          sirenNumber: '123456789',
          registrationNumber: 'RCS PARIS 123 456 789',
          incorporationDate: new Date('2023-01-01'),
          incorporationPlace: 'Paris',
          email: 'contact@techstartup.fr',
          phone: '+33123456789',
          type: 'SAS',
          capital: 10000
        }
      }
    }
  })

  const companyEntity2 = await prisma.entity.create({
    data: {
      type: 'COMPANY',
      userId: user2.id,
      company: {
        create: {
          name: 'Consulting Plus SARL',
          address: '321 Consulting St, 69001 Lyon',
          sirenNumber: '987654321',
          registrationNumber: 'RCS LYON 987 654 321',
          incorporationDate: new Date('2020-06-15'),
          incorporationPlace: 'Lyon',
          email: 'contact@consultingplus.fr',
          phone: '+33987654321',
          type: 'SARL',
          capital: 5000
        }
      }
    }
  })

  // Create sample documents
  const document1 = await prisma.document.create({
    data: {
      name: 'Non-Disclosure Agreement',
      jurisdiction: 'France',
      userId: user1.id,
      fromEntityId: companyEntity1.id,
      toEntityId: personEntity2.id,
      status: 'DRAFT',
      metadata: {
        version: '1.0',
        language: 'FR',
        documentType: 'NDA',
        createdAt: new Date().toISOString()
      }
    }
  })

  const document2 = await prisma.document.create({
    data: {
      name: 'Service Agreement',
      jurisdiction: 'France',
      userId: user2.id,
      fromEntityId: companyEntity2.id,
      toEntityId: companyEntity1.id,
      status: 'SIGNED',
      metadata: {
        version: '1.0',
        language: 'FR',
        documentType: 'SERVICE_AGREEMENT',
        createdAt: new Date().toISOString(),
        signedAt: new Date().toISOString()
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
