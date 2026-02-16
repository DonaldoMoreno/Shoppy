import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async create(shopperId: string, dto: { requestId: string; itemEstimateCents: number; shopperFeeCents: number; shippingEstimateCents: number; slaDays: number; notes?: string }) {
    const request = await this.prisma.request.findUnique({ where: { id: dto.requestId } })
    if (!request) throw new NotFoundException('Request not found')

    return this.prisma.offer.create({
      data: {
        requestId: dto.requestId,
        shopperId,
        itemEstimateCents: dto.itemEstimateCents,
        shopperFeeCents: dto.shopperFeeCents,
        shippingEstimateCents: dto.shippingEstimateCents,
        slaDays: dto.slaDays,
        notes: dto.notes
      }
    })
  }

  listForRequest(requestId: string) {
    return this.prisma.offer.findMany({ where: { requestId }, orderBy: { createdAt: 'desc' } })
  }

  async acceptOffer(clientId: string, offerId: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId }, include: { request: true } })
    if (!offer) throw new NotFoundException('Offer not found')
    if (offer.request.clientId !== clientId) throw new BadRequestException('Not owner of request')
    if (offer.accepted) throw new BadRequestException('Offer already accepted')

    const totalCents = offer.itemEstimateCents + offer.shopperFeeCents + offer.shippingEstimateCents

    const order = await this.prisma.order.create({
      data: {
        clientId,
        shopperId: offer.shopperId,
        offerId: offer.id,
        totalCents,
        platformHoldCents: totalCents,
        state: 'CREATED'
      }
    })

    await this.prisma.offer.update({ where: { id: offer.id }, data: { accepted: true } })

    return order
  }
}
