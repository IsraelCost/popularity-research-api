import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { IHasher } from '../../application/contracts/hasher'

@Injectable()
export class Hasher implements IHasher {
  private readonly SALT = 10

  encode (value: string): string {
    return bcrypt.hashSync(value, this.SALT)
  }

  compare (given: string, toCompare: string): boolean {
    return bcrypt.compareSync(given, toCompare)
  }
}
