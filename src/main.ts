import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { logger } from './common/middlewares/logger.middleware'

async function start() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const PORT = config.getOrThrow('PORT')

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  app.use(cookieParser())
  app.enableCors({
    origin: true,
    credentials: true,
  })

  app.use(logger)

  await app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}
start()
