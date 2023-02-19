import { Injectable, Inject } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { IUserRepository } from '../../domain/repositories/user'
import { AuthenticationDTO, IAuthentication } from '../../domain/usecases/authentication'
import { IHasher } from '../contracts/hasher'
import { IJwt } from '../contracts/jwt'
import { IValidation } from '../validation/leaves/contract'

@Injectable()
export class Authentication implements IAuthentication {
  constructor (
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('Hasher') private readonly hasher: IHasher,
    @Inject('Jwt') private readonly jwt: IJwt,
    @Inject('AuthenticationValidation') private readonly validation: IValidation
  ) { }

  async authenticate (input: AuthenticationDTO.Input): Promise<AuthenticationDTO.Output> {
    this.validation.validate(input)
    const user = await this.userRepository.findByEmail(input.email)
    if (!user || !this.hasher.compare(input.password, user.password)) throw new ApplicationError('Usuário ou senha incorretos', 400)
    if (!user.verified) throw new ApplicationError('Email pendente de verificação', 400)
    const token = this.jwt.generate({
      id: user.id,
      email: user.email,
      name: user.name,
      verified: user.verified,
      profile: user.profile
    }, '1d')
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      jwt: token,
      verified: user.verified,
      profile: user.profile
    }
  }
}
