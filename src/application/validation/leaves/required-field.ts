import { ApplicationError } from '../../../domain/entities/error'
import { IValidation } from './contract'

export class RequiredFieldValidation implements IValidation {
  constructor (
    private readonly field: string,
    private readonly as: string
  ) { }

  validate (input: any): void {
    if (!input[this.field]) throw new ApplicationError(`Campo ${this.as} vazio`, 400)
  }
}
