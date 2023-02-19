import { Controller, Inject, Post, Body, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { IAuthentication } from '../../domain/usecases/authentication'
import { ICreateUser } from '../../domain/usecases/create-user'
import { IVerificateEmail } from '../../domain/usecases/verificate-email'
import { SignInInput, SignInOutput, SignUpInput, SignUpOutput } from '../dto/auth'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor (
    @Inject('Authentication') private readonly authenticateUseCase: IAuthentication,
    @Inject('CreateUser') private readonly createUserUseCase: ICreateUser,
    @Inject('VerificateEmail') private readonly verificateEmailUseCase: IVerificateEmail
  ) { }

  @Post('sign-in')
  @ApiResponse({
    status: 200,
    type: SignInOutput
  })
  async signIn (@Body() input: SignInInput): Promise<SignInOutput> {
    const result = await this.authenticateUseCase.authenticate(input)
    return result
  }

  @Post('sign-up')
  @ApiResponse({
    status: 201,
    type: SignUpOutput
  })
  async signUp (@Body() input: SignUpInput): Promise<SignUpOutput> {
    const result = await this.createUserUseCase.create(input)
    return result
  }

  @Post('verificate')
  @ApiResponse({
    status: 200
  })
  async verificate (@Param('hash') hash: string): Promise<void> {
    await this.verificateEmailUseCase.verificate(hash)
  }
}
