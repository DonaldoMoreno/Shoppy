import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RequestsService } from './requests.service'

@Controller('requests')
export class RequestsController {
  constructor(private svc: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() body: any) {
    return this.svc.create(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  myRequests(@Request() req) {
    return this.svc.listForClient(req.user.id)
  }

  @Get()
  list() {
    return this.svc.listAll()
  }
}
