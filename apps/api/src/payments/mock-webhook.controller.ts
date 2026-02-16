import { Body, Controller, Post } from '@nestjs/common'

@Controller('webhooks')
export class MockWebhookController {
  @Post('mock')
  async mock(@Body() body: any) {
    // Accepts a webhook shape and echoes back — in real app we'd validate signatures
    return { received: true, payload: body }
  }
}
