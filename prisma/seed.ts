// File: prisma/seed.ts

import { PrismaClient, DroneStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Create a sample organization
  const org = await prisma.organization.create({
    data: {
      name: 'FlytBase Corp',
    },
  })

  // Create a few sample drones for this organization
  await prisma.drone.create({
    data: {
      name: 'DJI Mavic 3 Enterprise',
      model: 'Mavic 3E',
      status: DroneStatus.AVAILABLE,
      batteryLevel: 100,
      organizationId: org.id,
    },
  })

  await prisma.drone.create({
    data: {
      name: 'WingtraOne Gen II',
      model: 'WingtraOne',
      status: DroneStatus.IN_MISSION,
      batteryLevel: 67,
      organizationId: org.id,
    },
  })

  await prisma.drone.create({
    data: {
      name: 'Parrot Anafi AI',
      model: 'Anafi AI',
      status: DroneStatus.MAINTENANCE,
      batteryLevel: 33,
      organizationId: org.id,
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })