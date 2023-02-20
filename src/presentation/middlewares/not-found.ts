import { Catch, NotFoundException, ExceptionFilter, ArgumentsHost } from '@nestjs/common'

@Catch(NotFoundException)
export class NotFound implements ExceptionFilter {
  catch (_exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    response.status(404).json({ code: 404, message: 'Not found' })
  }
}
