import { Injectable } from '@nestjs/common'
import { IValidation } from './leaves/contract'
import { EmailValidation } from './leaves/email'
import { RequiredFieldValidation } from './leaves/required-field'

@Injectable()
export class CreateUserValidation implements IValidation {
  private readonly validations: IValidation[] = [
    new RequiredFieldValidation('email', 'email'),
    new RequiredFieldValidation('name', 'nome'),
    new RequiredFieldValidation('password', 'senha'),
    new EmailValidation('email')
  ]

  validate (input: any): void {
    this.validations.forEach(validation => {
      validation.validate(input)
    })
  }
}
