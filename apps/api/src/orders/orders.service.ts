import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { OrderState } from './dto/update-order-state.dto'

const STATE_TRANSITIONS: Record<OrderState, OrderState[]> = {
  CREATED: ['FUNDED', 'CANCELLED'],
  FUNDED: ['PURCHASED', 'CANCELLED', 'DISPUTED'],
  PURCHASED: ['SHIPPED', 'DISPUTED'],
  SHIPPED: ['DELIVERED', 'DISPUTED'],
  DELIVERED: ['COMPLETED', 'DISPUTED'],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: ['REFUNDED'],
  REFUNDED: []
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private async createUpload(uploadedById: string, payload: { key: string; url: string; mime: string; size: number }) {
    return this.prisma.upload.create({
      data: {
        uploadedById,
        key: payload.key,
        url: payload.url,
        mime: payload.mime,
        size: payload.size
      }
    })
  }

  async listForUser(userId: string, role: string) {
    if (role === 'SHOPPER') {
      return this.prisma.order.findMany({ where: { shopperId: userId }, orderBy: { createdAt: 'desc' } })
    }
    return this.prisma.order.findMany({ where: { clientId: userId }, orderBy: { createdAt: 'desc' } })
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async updateState(orderId: string, next: OrderState) {
    const order = await this.findById(orderId)
    const allowed = STATE_TRANSITIONS[order.state as OrderState] || []
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid transition: ${order.state} -> ${next}`)
    }

    return this.prisma.order.update({ where: { id: orderId }, data: { state: next } })
  }

  async updateStateForUser(orderId: string, userId: string, role: string, next: OrderState) {
    const order = await this.findById(orderId)
    if (role === 'SHOPPER' && order.shopperId !== userId) {
      throw new BadRequestException('Not your order')
    }
    if (role !== 'SHOPPER' && order.clientId !== userId) {
      throw new BadRequestException('Not your order')
    }
    return this.updateState(orderId, next)
  }

  async fundOrder(orderId: string, clientId: string) {
    const order = await this.findById(orderId)
    if (order.clientId !== clientId) throw new BadRequestException('Not your order')
    if (order.state !== 'CREATED') throw new BadRequestException('Order not in CREATED')

    return this.updateState(orderId, 'FUNDED')
  }

  async addPurchaseEvidence(orderId: string, shopperId: string, dto: { receiptKey: string; receiptUrl: string; receiptMime: string; receiptSize: number; productPhotoKey: string; productPhotoUrl: string; productPhotoMime: string; productPhotoSize: number; receiptAmountCents: number }) {
    const order = await this.findById(orderId)
    if (order.shopperId !== shopperId) throw new BadRequestException('Not your order')
    if (!['FUNDED', 'PURCHASED'].includes(order.state)) {
      throw new BadRequestException('Order not in FUNDED or PURCHASED')
    }

    const receipt = await this.createUpload(shopperId, {
      key: dto.receiptKey,
      url: dto.receiptUrl,
      mime: dto.receiptMime,
      size: dto.receiptSize
    })
    const photo = await this.createUpload(shopperId, {
      key: dto.productPhotoKey,
      url: dto.productPhotoUrl,
      mime: dto.productPhotoMime,
      size: dto.productPhotoSize
    })

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        purchaseReceiptId: receipt.id,
        purchasePhotoId: photo.id,
        purchaseReceiptAmountCents: dto.receiptAmountCents,
        state: order.state === 'FUNDED' ? 'PURCHASED' : order.state
      }
    })
  }

  async addShipmentEvidence(orderId: string, shopperId: string, dto: { shippingReceiptKey: string; shippingReceiptUrl: string; shippingReceiptMime: string; shippingReceiptSize: number; packagePhotoKey: string; packagePhotoUrl: string; packagePhotoMime: string; packagePhotoSize: number }) {
    const order = await this.findById(orderId)
    if (order.shopperId !== shopperId) throw new BadRequestException('Not your order')
    if (!['PURCHASED', 'SHIPPED'].includes(order.state)) {
      throw new BadRequestException('Order not in PURCHASED or SHIPPED')
    }

    const receipt = await this.createUpload(shopperId, {
      key: dto.shippingReceiptKey,
      url: dto.shippingReceiptUrl,
      mime: dto.shippingReceiptMime,
      size: dto.shippingReceiptSize
    })
    const photo = await this.createUpload(shopperId, {
      key: dto.packagePhotoKey,
      url: dto.packagePhotoUrl,
      mime: dto.packagePhotoMime,
      size: dto.packagePhotoSize
    })

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        shipmentReceiptId: receipt.id,
        shipmentPhotoId: photo.id,
        state: order.state === 'PURCHASED' ? 'SHIPPED' : order.state
      }
    })
  }

  async captureTracking(orderId: string, shopperId: string, dto: { carrier: string; trackingNumber: string }) {
    const order = await this.findById(orderId)
    if (order.shopperId !== shopperId) throw new BadRequestException('Not your order')

    const event = { at: new Date().toISOString(), status: 'SHIPPED', carrier: dto.carrier }
    const tracking = await this.prisma.tracking.upsert({
      where: { orderId },
      update: {
        carrier: dto.carrier,
        trackingNumber: dto.trackingNumber,
        lastStatus: 'SHIPPED',
        events: { set: [event] }
      },
      create: {
        orderId,
        carrier: dto.carrier,
        trackingNumber: dto.trackingNumber,
        lastStatus: 'SHIPPED',
        events: [event]
      }
    })

    if (order.state === 'PURCHASED') {
      await this.updateState(orderId, 'SHIPPED')
    }

    return tracking
  }
}
