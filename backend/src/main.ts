import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { PrismaClientExceptionFilter } from './exception-filters/prisma.exception-filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
  })
  app.setGlobalPrefix('v1')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useGlobalFilters(new PrismaClientExceptionFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
