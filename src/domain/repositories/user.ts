import { User } from '../entities/user'

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: string) => Promise<User | null>
  save: (user: User) => Promise<User>
  edit: (id: string, user: User) => Promise<User>
}
