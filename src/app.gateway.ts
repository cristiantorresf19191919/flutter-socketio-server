import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    console.log("llego el mensaje del cliente ",payload);
    this.server.emit('msgToClient', payload);
  }

  @SubscribeMessage('mensaje')
  handleMessage2(client: Socket, payload: string): void {
    console.log("recivido el mensaje por socket al presionar el boton");
    console.log(payload);
    // emitir a todos los clientes
    this.server.io("mensaje",{name:"admin",text:"nuevo mensaje"});
    // this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    console.log("se desconecto el socket");
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log("se conecto el socket");
    this.logger.log(`Client connected: ${client.id}`);
   }

  
}
