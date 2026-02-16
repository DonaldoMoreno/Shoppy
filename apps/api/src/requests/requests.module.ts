import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { RequestsService } from './requests.service'
import { RequestsController } from './requests.controller'

@Module({
  imports: [PrismaModule],
  providers: [RequestsService],
  controllers: [RequestsController]
})
export class RequestsModule {}
