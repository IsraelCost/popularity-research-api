import { Injectable } from '@nestjs/common'
import { IValidation } from './leaves/contract'
import { RequiredFieldValidation } from './leaves/required-field'

@Injectable()
export class VotingValidation implements IValidation {
  private readonly validations: IValidation[] = [
    new RequiredFieldValidation('phoneNumber', 'número de telefone'),
    new RequiredFieldValidation('deviceIp', 'ip do dispositivo')
  ]

  validate (input: any): void {
    this.validations.forEach(validation => {
      validation.validate(input)
    })
  }
}
