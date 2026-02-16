import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  try {
    const config = new DocumentBuilder()
      .setTitle('Shoppy API')
      .setDescription('Personal Shopper Marketplace - MVP')
      .setVersion('0.1')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  } catch (err) {
    console.warn('Swagger docs disabled (incompatible @nestjs/swagger)')
  }

  await app.listen(process.env.APP_PORT || 3001)
  console.log('API running on', await app.getUrl())
}
bootstrap()
