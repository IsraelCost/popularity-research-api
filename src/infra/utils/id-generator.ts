import { Injectable } from '@nestjs/common'
import * as uuid from 'uuid'
import { IIdGenerator } from '../../application/contracts/id-generator'

@Injectable()
export class IdGenerator implements IIdGenerator {
  generate (): string {
    return uuid.v4()
  }
}
