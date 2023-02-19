import { Injectable } from '@nestjs/common'
import store from 'store2'
import { IStorage, StorageKeys } from '../../application/contracts/storage'

@Injectable()
export class Store implements IStorage {
  set (key: StorageKeys, value: any) {
    store.set(key, value)
  }

  get (key: StorageKeys): any {
    return store.get(key)
  }
}
