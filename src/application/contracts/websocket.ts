/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http'

export interface IWebSocket {
  init: (server: Server, callback: Function) => void
  emit: (eventName: string, data: any) => void
  emitToAll: (eventName: string, data: any) => void
  on: (eventName: string, callback: (data: any) => any) => void
}
