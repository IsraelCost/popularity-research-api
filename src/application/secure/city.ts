import { Injectable, Inject } from '@nestjs/common'
import { City } from '../../domain/entities/city'
import { ApplicationError } from '../../domain/entities/error'
import { UserProfile } from '../../domain/entities/user'
import { CityServiceDTO, ICityService } from '../../domain/services/city'
import { ISessionManager } from '../contracts/session-getter'
import { RequiredFieldValidation } from '../validation/leaves/required-field'

@Injectable()
export class CitySecureService implements ICityService {
  constructor (
    @Inject('CityService') private readonly cityService: ICityService,
    @Inject('SessionManager') private readonly sessionManager: ISessionManager
  ) { }

  private validateProfile () {
    const session = this.sessionManager.get()

    if (session.profile !== UserProfile.ROOT) throw new ApplicationError('Operação não permitida', 403)
  }

  async get (): Promise<City[]> {
    return await this.cityService.get()
  }

  async getOne (id: string): Promise<City> {
    return await this.cityService.getOne(id)
  }

  async create (input: CityServiceDTO.Create): Promise<City> {
    this.validateProfile()

    const attributesValidation = [
      new RequiredFieldValidation('name', 'nome'),
      new RequiredFieldValidation('picture', 'foto')
    ]

    attributesValidation.forEach(validation => {
      validation.validate(input)
    })

    return await this.cityService.create(input)
  }

  async update (id: string, input: CityServiceDTO.Update): Promise<City> {
    this.validateProfile()

    return await this.cityService.update(id, input)
  }

  async delete (id: string): Promise<void> {
    this.validateProfile()

    await this.cityService.delete(id)
  }
}
