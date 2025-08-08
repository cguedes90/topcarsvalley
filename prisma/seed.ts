import { PrismaClient, UserRole, EventCategory, PartnerCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for admin user
  const adminPassword = await bcrypt.hash('TopCars2025!', 12)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@topcarsvalley.com' },
    update: {
      password: adminPassword,
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin@topcarsvalley.com',
      name: 'Admin TopCars Valley',
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: '+55 11 99999-9999',
      isActive: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample member users
  const memberUsers = [
    {
      email: 'carlos.silva@email.com',
      name: 'Carlos Silva',
      phone: '+55 11 98765-4321',
      role: UserRole.MEMBER,
      isActive: true,
    },
    {
      email: 'maria.santos@email.com', 
      name: 'Maria Santos',
      phone: '+55 11 97654-3210',
      role: UserRole.MEMBER,
      isActive: true,
    },
    {
      email: 'joao.oliveira@email.com',
      name: 'João Oliveira',
      phone: '+55 11 96543-2109',
      role: UserRole.MEMBER,
      isActive: false, // Inactive user example
    },
    {
      email: 'ana.costa@email.com',
      name: 'Ana Costa',
      role: UserRole.MEMBER,
      isActive: false,
      inviteToken: 'invite_token_123_' + Date.now(),
      invitedById: adminUser.id, // Invited by admin
    }
  ];

  for (const userData of memberUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  console.log('✅ Sample member users created')

  // Create sample events
  const events = [
    {
      title: 'Track Day - Autódromo de Interlagos',
      description: 'Dia completo de pista no lendário circuito de Interlagos. Aberto para todos os níveis de experiência. Inclui briefing de segurança, sessões de prática livre e instruções técnicas.',
      shortDescription: 'Dia completo de pista no lendário circuito de Interlagos.',
      date: new Date('2024-09-15'),
      time: '08:00',
      location: 'Autódromo José Carlos Pace, Interlagos - SP',
      maxParticipants: 50,
      category: EventCategory.TRACK_DAY,
      price: 'R$ 350,00',
      isPublic: true,
      isActive: true,
    },
    {
      title: 'Encontro TopCars - Shopping JK Iguatemi',
      description: 'Encontro mensal da comunidade TopCars Valley. Café da manhã, networking e exposição de veículos no estacionamento premium do shopping.',
      shortDescription: 'Encontro mensal da comunidade TopCars Valley.',
      date: new Date('2024-09-22'),
      time: '09:00',
      location: 'JK Iguatemi, São Paulo - SP',
      maxParticipants: 30,
      category: EventCategory.ENCONTRO,
      price: 'Gratuito',
      isPublic: true,
      isActive: true,
    },
    {
      title: 'Workshop de Pilotagem Esportiva',
      description: 'Curso prático de técnicas de pilotagem esportiva com instrutores profissionais. Inclui teoria e prática em pista.',
      shortDescription: 'Curso prático de técnicas de pilotagem esportiva.',
      date: new Date('2024-10-05'),
      time: '09:00',
      location: 'Autódromo de Tarumã, RS',
      maxParticipants: 20,
      category: EventCategory.WORKSHOP,
      price: 'R$ 450,00',
      isPublic: true,
      isActive: true,
    },
    {
      title: 'Road Trip - Serra da Mantiqueira',
      description: 'Aventura de dois dias pelas curvas mais bonitas da Serra da Mantiqueira. Inclui hospedagem e refeições.',
      shortDescription: 'Aventura de dois dias pelas curvas mais bonitas da Serra da Mantiqueira.',
      date: new Date('2024-10-12'),
      time: '07:00',
      location: 'Campos do Jordão - SP',
      maxParticipants: 25,
      category: EventCategory.ROAD_TRIP,
      price: 'R$ 850,00',
      isPublic: true,
      isActive: true,
    },
    {
      title: 'Exposição Clássicos & Superesportivos',
      description: 'Grande exposição de carros clássicos e superesportivos. Aberto ao público com área VIP para membros.',
      shortDescription: 'Grande exposição de carros clássicos e superesportivos.',
      date: new Date('2024-10-20'),
      time: '10:00',
      location: 'Expo Center Norte, São Paulo - SP',
      maxParticipants: 200,
      category: EventCategory.EXPOSICAO,
      price: 'R$ 25,00',
      isPublic: true,
      isActive: true,
    },
    {
      title: 'Competição TopCars Challenge',
      description: 'Competição exclusiva para membros. Modalidade time attack com cronometragem oficial.',
      shortDescription: 'Competição exclusiva para membros.',
      date: new Date('2024-11-10'),
      time: '08:00',
      location: 'Autódromo de Goiânia - GO',
      maxParticipants: 40,
      category: EventCategory.COMPETICAO,
      price: 'R$ 280,00',
      isPublic: false,
      isActive: true,
    },
  ]

  for (const eventData of events) {
    const existingEvent = await prisma.event.findFirst({
      where: { title: eventData.title }
    })
    
    if (!existingEvent) {
      await prisma.event.create({
        data: eventData,
      })
    }
  }

  console.log('✅ Sample events created')

  // Create sample partners
  const partners = [
    {
      name: 'AutoEsporte Magazine',
      description: 'Revista líder em conteúdo automotivo no Brasil.',
      category: PartnerCategory.MEDIA,
      website: 'https://autoesporte.globo.com',
      isActive: true,
    },
    {
      name: 'Michelin Brasil',
      description: 'Líder mundial em tecnologia de pneus para alta performance.',
      category: PartnerCategory.AUTOMOTIVE,
      website: 'https://michelin.com.br',
      isActive: true,
    },
    {
      name: 'Shell Helix',
      description: 'Óleos lubrificantes premium para motores de alta performance.',
      category: PartnerCategory.AUTOMOTIVE,
      website: 'https://shell.com.br',
      isActive: true,
    },
    {
      name: 'Track Days Brasil',
      description: 'Organização especializada em track days e eventos em autódromos.',
      category: PartnerCategory.SERVICES,
      website: 'https://trackdaysbrasil.com.br',
      isActive: true,
    },
  ]

  for (const partnerData of partners) {
    const existingPartner = await prisma.partner.findFirst({
      where: { name: partnerData.name }
    })
    
    if (!existingPartner) {
      await prisma.partner.create({
        data: partnerData,
      })
    }
  }

  console.log('✅ Sample partners created')

  // Create test user Cedrique Guedes if not exists
  const testUser = await prisma.user.upsert({
    where: { email: 'cedriquepereira@gmail.com' },
    update: {},
    create: {
      email: 'cedriquepereira@gmail.com',
      name: 'Cedrique Guedes',
      phone: '+5511974508168',
      password: await bcrypt.hash('123456', 12),
      role: UserRole.MEMBER,
      isActive: true,
    },
  })

  console.log('✅ Test user created:', testUser.email)

  // Create sample vehicles for the test user
  const vehicles = [
    {
      brand: 'Audi',
      model: 'TT',
      year: 2009,
      color: 'Preto',
      fuelType: 'Gasolina',
      horsepower: 200,
      description: 'Audi TT 2009 em excelente estado, motor 2.0 turbo',
      photos: [],
      isPublic: true,
      ownerId: testUser.id,
    },
    {
      brand: 'BMW',
      model: 'M3',
      year: 2015,
      color: 'Azul',
      fuelType: 'Gasolina',
      horsepower: 425,
      description: 'BMW M3 2015 performance, motor V6 biturbo',
      photos: [],
      isPublic: true,
      ownerId: testUser.id,
    },
    {
      brand: 'Mercedes-Benz',
      model: 'AMG GT',
      year: 2018,
      color: 'Prata',
      fuelType: 'Gasolina',
      horsepower: 462,
      description: 'Mercedes AMG GT 2018, motor V8 4.0 biturbo',
      photos: [],
      isPublic: true,
      ownerId: testUser.id,
    }
  ]

  for (const vehicleData of vehicles) {
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { 
        ownerId: vehicleData.ownerId,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year
      }
    })
    
    if (!existingVehicle) {
      await prisma.vehicle.create({
        data: vehicleData,
      })
    }
  }

  console.log('✅ Sample vehicles created')
  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
