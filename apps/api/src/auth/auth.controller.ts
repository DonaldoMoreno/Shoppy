import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.auth.validateUser(body.email, body.password)
    return this.auth.login(user)
  }

  @Post('oauth-stub')
  oauthStub() {
    // placeholder for OAuth flow
    return { message: 'OAuth stub - not implemented' }
  }
}
