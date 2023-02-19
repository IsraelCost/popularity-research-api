import { Inject, Injectable } from '@nestjs/common'
import { IJwt } from '../../application/contracts/jwt'
import { ISessionManager } from '../../application/contracts/session-getter'
import { IStorage, StorageKeys } from '../../application/contracts/storage'
import { Session } from '../../application/models/session'

@Injectable()
export class SessionManager implements ISessionManager {
  constructor (
    @Inject('Jwt') private readonly jwt: IJwt,
    @Inject('Storage') private readonly storage: IStorage
  ) { }

  set (token: string) {
    const session = this.jwt.verify(token)
    this.storage.set(StorageKeys.TOKEN, session)
  }

  get (): Session {
    const session = this.storage.get(StorageKeys.TOKEN)
    return session
  }
}
