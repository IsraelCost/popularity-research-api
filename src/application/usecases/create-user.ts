import { Injectable, Inject } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { Ticket } from '../../domain/entities/ticket'
import { User, UserProfile } from '../../domain/entities/user'
import { ITicketRepository } from '../../domain/repositories/ticket'
import { IUserRepository } from '../../domain/repositories/user'
import { CreateUserDTO, ICreateUser } from '../../domain/usecases/create-user'
import { IHasher } from '../contracts/hasher'
import { IIdGenerator } from '../contracts/id-generator'
import { IMailer } from '../contracts/mailer'
import { IValidation } from '../validation/leaves/contract'

@Injectable()
export class CreateUser implements ICreateUser {
  constructor (
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('IdGenerator') private readonly idGenerator: IIdGenerator,
    @Inject('Hasher') private readonly hasher: IHasher,
    @Inject('Mailer') private readonly mailer: IMailer,
    @Inject('TicketRepository') private readonly ticketRepository: ITicketRepository,
    @Inject('CreateUserValidation') private readonly validation: IValidation
  ) { }

  async create (input: CreateUserDTO.Input): Promise<CreateUserDTO.Output> {
    this.validation.validate(input)
    const userAlreadyExists = await this.userRepository.findByEmail(input.email)
    if (userAlreadyExists) throw new ApplicationError('Usuário já cadastrado na aplicação', 400)
    const NOT_VERIFIED = false
    const hashedPassword = this.hasher.encode(input.password)
    const user = new User(
      this.idGenerator.generate(),
      input.email,
      input.name,
      NOT_VERIFIED,
      hashedPassword,
      UserProfile.ACCESS
    )
    const ticket: Ticket = {
      id: this.idGenerator.generate(),
      code: this.hasher.encode(user.id),
      userId: user.id
    }
    await this.ticketRepository.save(ticket)
    // await this.sendMail(user, ticket)
    const createdUser = await this.userRepository.save(user)
    return {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      verified: createdUser.verified,
      profile: createdUser.profile
    }
  }

  async sendMail (user: User, ticket: Ticket) {
    await this.mailer.send({
      to: user.email,
      subject: 'Verificação de email',
      data: { hash: ticket.code, name: user.name },
      htmlTemplate: 'email-verification'
    })
  }
}
