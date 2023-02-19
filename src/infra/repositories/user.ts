import { Injectable } from '@nestjs/common'
import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../domain/repositories/user'
import { UserMongoDBModel } from '../db/models/user'

@Injectable()
export class UserRepository implements IUserRepository {
  private toModel (data: any): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.verified,
      data.password,
      data.profile
    )
  }

  async findById (id: string): Promise<User | null> {
    const userData = await UserMongoDBModel.findOne({ id })
    if (!userData) return null
    return this.toModel(userData)
  }

  async findByEmail (email: string): Promise<User | null> {
    const userData = await UserMongoDBModel.findOne({ email })
    if (!userData) return null
    return this.toModel(userData)
  }

  async save (user: User): Promise<User> {
    const userData = await UserMongoDBModel.create(user)
    return this.toModel(userData)
  }

  async edit (id: string, user: User): Promise<User> {
    await UserMongoDBModel.updateOne({ id }, user)
    return (await this.findById(id))!
  }
}
