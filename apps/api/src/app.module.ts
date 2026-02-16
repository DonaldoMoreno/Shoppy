import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BullModule } from '@nestjs/bullmq'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { HealthController } from './health.controller'
import { MockWebhookController } from './payments/mock-webhook.controller'
import { RequestsModule } from './requests/requests.module'
import { OffersModule } from './offers/offers.module'
import { OrdersModule } from './orders/orders.module'
import { UploadsModule } from './uploads/uploads.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379)
      }
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RequestsModule,
    OffersModule,
    OrdersModule,
    UploadsModule
  ],
  controllers: [HealthController, MockWebhookController]
})
export class AppModule {}

