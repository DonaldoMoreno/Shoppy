import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.$connect()
  console.log('Seeding demo data...')

  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shoppy.test' },
    update: {},
    create: {
      email: 'admin@shoppy.test',
      passwordHash: password,
      name: 'Admin',
      role: 'ADMIN',
      kycStatus: 'VERIFIED'
    }
  })

  const client = await prisma.user.upsert({
    where: { email: 'client@shoppy.test' },
    update: {},
    create: {
      email: 'client@shoppy.test',
      passwordHash: password,
      name: 'Demo Client',
      role: 'CLIENT'
    }
  })

  const shopper = await prisma.user.upsert({
    where: { email: 'shopper@shoppy.test' },
    update: {},
    create: {
      email: 'shopper@shoppy.test',
      passwordHash: password,
      name: 'Demo Shopper',
      role: 'SHOPPER',
      kycStatus: 'VERIFIED'
    }
  })

  // sample request -> offer -> accepted order progression
  const request = await prisma.request.create({
    data: {
      clientId: client.id,
      title: 'Purchase: Limited edition shoes',
      description: 'Please buy the latest sneakers and ship to Guadalajara, MX',
      budgetCents: 20000,
      destinationCity: 'Guadalajara',
      category: 'Footwear'
    }
  })

  const offer = await prisma.offer.create({
    data: {
      requestId: request.id,
      shopperId: shopper.id,
      itemEstimateCents: 15000,
      shopperFeeCents: 2000,
      shippingEstimateCents: 3000,
      slaDays: 7,
      notes: 'I can source this from local reseller'
    }
  })

  const order = await prisma.order.create({
    data: {
      clientId: client.id,
      shopperId: shopper.id,
      offerId: offer.id,
      totalCents: 20000,
      platformHoldCents: 20000,
      state: 'CREATED'
    }
  })

  console.log({ admin: admin.email, client: client.email, shopper: shopper.email, requestId: request.id, offerId: offer.id, orderId: order.id })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
