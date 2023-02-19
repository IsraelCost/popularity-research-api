import { Ticket } from '../entities/ticket'

export interface ITicketRepository {
  save: (ticket: Ticket) => Promise<Ticket>
  findByHash: (hash: string) => Promise<Ticket | null>
  delete: (id: string) => Promise<void>
}
