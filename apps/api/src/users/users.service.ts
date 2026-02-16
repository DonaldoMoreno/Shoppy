import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string, name?: string, role = 'CLIENT') {
    const hash = await bcrypt.hash(password, 10)
    return this.prisma.user.create({ data: { email, passwordHash: hash, name, role } })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id } })
    if (!u) throw new NotFoundException('User not found')
    return u
  }

  async validatePassword(email: string, plain: string) {
    const user = await this.findByEmail(email)
    if (!user) return null
    const ok = await bcrypt.compare(plain, user.passwordHash)
    return ok ? user : null
  }
}
