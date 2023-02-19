import { Injectable } from '@nestjs/common'
import { Ticket } from '../../domain/entities/ticket'
import { ITicketRepository } from '../../domain/repositories/ticket'
import { TicketMongoDBModel } from '../db/models/ticket'

@Injectable()
export class TicketRepository implements ITicketRepository {
  private toModel (data: any): Ticket {
    return {
      id: data.id,
      code: data.code,
      userId: data.userId
    }
  }

  async findByHash (hash: string): Promise<Ticket | null> {
    const ticketData = await TicketMongoDBModel.findOne({ hash })
    if (!ticketData) return null
    return this.toModel(ticketData)
  }

  async save (ticket: Ticket): Promise<Ticket> {
    const ticketData = await TicketMongoDBModel.create(ticket)
    return this.toModel(ticketData)
  }

  async delete (id: string): Promise<void> {
    await TicketMongoDBModel.deleteOne({ id })
  }
}
