import { BadRequestException, Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { CaptureTrackingDto } from './dto/capture-tracking.dto'
import { CreatePurchaseEvidenceDto } from './dto/create-purchase-evidence.dto'
import { CreateShipmentEvidenceDto } from './dto/create-shipment-evidence.dto'
import { UpdateOrderStateDto } from './dto/update-order-state.dto'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  listMine(@Request() req) {
    return this.svc.listForUser(req.user.id, req.user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  find(@Param('id') id: string) {
    return this.svc.findById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Post(':id/fund')
  fund(@Request() req, @Param('id') id: string) {
    return this.svc.fundOrder(id, req.user.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SHOPPER', 'CLIENT')
  @Post(':id/state')
  updateState(@Request() req, @Param('id') id: string, @Body() body: UpdateOrderStateDto) {
    if (req.user.role === 'SHOPPER' && ['DELIVERED', 'COMPLETED'].includes(body.state)) {
      throw new BadRequestException('Shoppers cannot deliver/complete orders')
    }
    if (req.user.role === 'CLIENT' && ['PURCHASED', 'SHIPPED'].includes(body.state)) {
      throw new BadRequestException('Clients cannot mark purchase/shipped')
    }
    return this.svc.updateStateForUser(id, req.user.id, req.user.role, body.state)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SHOPPER')
  @Post(':id/evidence/purchase')
  addPurchaseEvidence(@Request() req, @Param('id') id: string, @Body() body: CreatePurchaseEvidenceDto) {
    return this.svc.addPurchaseEvidence(id, req.user.id, body)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SHOPPER')
  @Post(':id/evidence/shipment')
  addShipmentEvidence(@Request() req, @Param('id') id: string, @Body() body: CreateShipmentEvidenceDto) {
    return this.svc.addShipmentEvidence(id, req.user.id, body)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SHOPPER')
  @Post(':id/tracking')
  captureTracking(@Request() req, @Param('id') id: string, @Body() body: CaptureTrackingDto) {
    return this.svc.captureTracking(id, req.user.id, body)
  }
}
