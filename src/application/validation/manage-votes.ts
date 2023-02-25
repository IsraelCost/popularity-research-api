import { Inject, Injectable } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { UserProfile } from '../../domain/entities/user'
import { ISessionManager } from '../contracts/session-getter'
import { IValidation } from './leaves/contract'
import { RequiredFieldValidation } from './leaves/required-field'

@Injectable()
export class ManageVotesValidation implements IValidation {
  private readonly validations: IValidation[] = [
    new RequiredFieldValidation('options', 'porcentagens')
  ]

  constructor (
    @Inject('SessionManager') private readonly sessionManager: ISessionManager
  ) { }

  validate (input: any): void {
    const session = this.sessionManager.get()

    if (session.profile !== UserProfile.ROOT) throw new ApplicationError('Não autorizado', 403)

    this.validations.forEach(validation => {
      validation.validate(input)
    })
  }
}
