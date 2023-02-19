import { Inject } from '@nestjs/common'
import { ApplicationError } from '../../../domain/entities/error'
import { UserProfile } from '../../../domain/entities/user'
import { SessionManager } from '../../../infra/security/session-getter'
import { ISessionManager } from '../../contracts/session-getter'
import { IValidation } from './contract'

export class ProfileValidation implements IValidation {
  @Inject(SessionManager)
  private readonly sessionManager!: ISessionManager

  constructor (
    private readonly authorized: UserProfile
  ) { }

  validate (): void {
    const session = this.sessionManager.get()
    if (session.profile !== this.authorized) throw new ApplicationError('Você não tem permissões suficientes para essa operação', 403)
  }
}
