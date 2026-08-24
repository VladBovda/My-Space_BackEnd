import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  afterInit() {
    // WebSocket server initialized
  }

  handleConnection() {
    // Client connected
  }

  handleDisconnect() {
    // Client disconnected
  }

  @SubscribeMessage('newExhibit')
  notifyNewExhibit(data: { description: string; user: string }) {
    this.server.emit('newExhibit', data);
  }
}
