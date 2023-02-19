import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import { ApplicationError } from '../../domain/entities/error'

@Catch()
export class ErrorHandler implements ExceptionFilter {
  catch (exception: any, host: ArgumentsHost) {
    console.error(exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    let code = 500
    if (exception instanceof ApplicationError) {
      code = exception.code
    }
    response.status(code).json({
      code,
      message: exception.message
    })
  }
}
