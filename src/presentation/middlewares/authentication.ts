import { NestMiddleware, Injectable, Inject } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ISessionManager } from '../../application/contracts/session-getter'
import { ApplicationError } from '../../domain/entities/error'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (
    @Inject('SessionManager') private readonly sessionManager: ISessionManager
  ) {}

  async use (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    if (!authorization) throw new ApplicationError('Não autorizado', 401)
    const [type, token] = authorization.split(' ')
    if (!type || !token) throw new ApplicationError('Não autorizado', 401)
    if (type !== 'Bearer') throw new ApplicationError('Não autorizado', 401)
    this.sessionManager.set(token)
    next()
  }
}
