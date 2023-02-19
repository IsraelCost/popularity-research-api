/* eslint-disable @typescript-eslint/ban-types */
import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { IWebSocket } from '../../application/contracts/websocket'
import { Injectable } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'

@Injectable()
export class SocketIoAdapter implements IWebSocket {
  private server!: Server
  private socket!: Socket

  init (httpServer: HttpServer, callback: Function): void {
    this.server = new Server(httpServer, {
      cors: {
        origin: '*'
      }
    })
    this.server.on('connection', (socket: Socket) => {
      console.log('SocketIO connected')
      this.socket = socket
      callback()
    })
  }

  emit (eventName: string, data: any): void {
    if (!this.server || !this.socket) throw new ApplicationError('Error initializing Socket Server', 500)
    this.socket.emit(eventName, data)
  }

  emitToAll (eventName: string, data: any): void {
    if (!this.server || !this.socket) throw new ApplicationError('Error initializing Socket Server', 500)
    this.server.sockets.emit(eventName, data)
  }

  on (eventName: string, callback: Function): void {
    if (!this.server || !this.socket) throw new ApplicationError('Error initializing Socket Server', 500)
    this.socket.on(eventName, async (data: any) => {
      await callback(data)
    })
  }
}
