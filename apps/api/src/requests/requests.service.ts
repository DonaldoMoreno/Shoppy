import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  create(clientId: string, dto: { title: string; description?: string; budgetCents: number; destinationCity: string; category: string }) {
    return this.prisma.request.create({ data: { clientId, ...dto } })
  }

  listForClient(clientId: string) {
    return this.prisma.request.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' } })
  }

  listAll() {
    return this.prisma.request.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  }

  findById(id: string) {
    return this.prisma.request.findUnique({ where: { id } })
  }
}
