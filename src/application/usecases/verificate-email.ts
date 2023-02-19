import { Injectable, Inject } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { ITicketRepository } from '../../domain/repositories/ticket'
import { IUserRepository } from '../../domain/repositories/user'
import { IVerificateEmail } from '../../domain/usecases/verificate-email'

@Injectable()
export class VerificateEmail implements IVerificateEmail {
  constructor (
    @Inject('TicketRepository') private readonly ticketRepository: ITicketRepository,
    @Inject('UserRepository') private readonly userRepository: IUserRepository
  ) { }

  async verificate (hash: string): Promise<void> {
    const ticket = await this.ticketRepository.findByHash(hash)
    if (!ticket) throw new ApplicationError('Ticket não existente', 404)
    const user = await this.userRepository.findById(ticket.userId)
    if (!user) throw new ApplicationError('Usuário não existente', 404)
    user.verified = true
    await this.userRepository.edit(user.id, user)
    await this.ticketRepository.delete(ticket.id)
  }
}
