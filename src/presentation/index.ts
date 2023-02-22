import dotenv from 'dotenv'
import express from 'express'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder } from '@nestjs/swagger'
import { SwaggerModule } from '@nestjs/swagger/dist'
import { connect } from '../infra/db/mongodb'
import { providers } from './providers'
import { AuthController } from './controllers/auth'
import { ErrorHandler } from './middlewares/error-handler'
import { SurveyController } from './controllers/survey'
import { AuthMiddleware } from './middlewares/authentication'
import { IWebSocket } from '../application/contracts/websocket'
import { NotFound } from './middlewares/not-found'
import { CityController } from './controllers/city'

@Module({
  controllers: [AuthController, SurveyController, CityController],
  providers
})
class AppModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/survey/:id', method: RequestMethod.GET },
        { path: '/survey/:id/question/vote', method: RequestMethod.POST },
        { path: '/city', method: RequestMethod.GET },
        { path: '/city/:id', method: RequestMethod.GET }
      )
      .forRoutes(SurveyController)
  }
}

const bootstrap = async () => {
  dotenv.config()
  await connect()
  const app = await NestFactory.create(AppModule)
  app.use(express.json({ limit: '50mb' }))
  app.useGlobalFilters(new ErrorHandler(), new NotFound())
  app.enableCors({
    origin: '*'
  })
  const swaggerConfig = new DocumentBuilder()
  swaggerConfig.setTitle('Popularity search API')
  swaggerConfig.setDescription('The API for popularity search')
  swaggerConfig.setVersion('1.0')
  swaggerConfig.addBearerAuth()
  const document = SwaggerModule.createDocument(app, swaggerConfig.build())
  SwaggerModule.setup('docs', app, document)
  const websocket = app.get<IWebSocket>('Websocket')
  websocket.init(app.getHttpServer(), () => {})
  const port = process.env.PORT || 4040
  await app.listen(port, () => {
    console.log(`Server running on port ${port} 🤑`)
  })
}

bootstrap()
