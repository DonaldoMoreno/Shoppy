import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { CreateOfferDto } from './dto/create-offer.dto'
import { OffersService } from './offers.service'

@Controller('offers')
export class OffersController {
  constructor(private svc: OffersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SHOPPER')
  @Post()
  create(@Request() req, @Body() body: CreateOfferDto) {
    return this.svc.create(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('request/:requestId')
  listForRequest(@Param('requestId') requestId: string) {
    return this.svc.listForRequest(requestId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Post(':id/accept')
  accept(@Request() req, @Param('id') id: string) {
    return this.svc.acceptOffer(req.user.id, id)
  }
}
