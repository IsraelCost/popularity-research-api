import { Injectable, Inject } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { Survey } from '../../domain/entities/survey'
import { UserProfile } from '../../domain/entities/user'
import { ISurveyService, SurveyServiceDTO } from '../../domain/services/survey'
import { ISessionManager } from '../contracts/session-getter'
import { RequiredFieldValidation } from '../validation/leaves/required-field'

@Injectable()
export class SurveySecureService implements ISurveyService {
  constructor (
    @Inject('SurveyService') private readonly surveyService: ISurveyService,
    @Inject('SessionManager') private readonly sessionManager: ISessionManager
  ) { }

  private validateProfile () {
    const session = this.sessionManager.get()
    if (session.profile !== UserProfile.ROOT) throw new ApplicationError('Operação não permitida', 403)
  }

  async get (): Promise<Survey[]> {
    this.validateProfile()

    return await this.surveyService.get()
  }

  async getOne (id: string): Promise<Survey> {
    this.validateProfile()

    return await this.surveyService.getOne(id)
  }

  async getSafe (id: string): Promise<SurveyServiceDTO.Safe> {
    return await this.surveyService.getSafe(id)
  }

  async create (input: SurveyServiceDTO.Create): Promise<Survey> {
    this.validateProfile()

    const attributesValidation = [
      new RequiredFieldValidation('label', 'título'),
      new RequiredFieldValidation('award', 'prêmio'),
      new RequiredFieldValidation('questions', 'questões')
    ]

    attributesValidation.forEach(validation => {
      validation.validate(input)
    })

    return await this.surveyService.create(input)
  }

  async update (id: string, input: SurveyServiceDTO.Update): Promise<Survey> {
    this.validateProfile()

    return await this.surveyService.update(id, input)
  }

  async delete (id: string): Promise<void> {
    this.validateProfile()

    await this.surveyService.delete(id)
  }
}
