import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.users.validatePassword(email, pass)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    return user
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return { accessToken: this.jwt.sign(payload) }
  }
}
