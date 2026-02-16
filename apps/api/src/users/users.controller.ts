import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string; role?: string }) {
    const u = await this.users.createUser(body.email, body.password, body.name, body.role)
    return { id: u.id, email: u.email, role: u.role }
  }

  @Get('me')
  async me(@Request() req) {
    return req.user || { anon: true }
  }
}
