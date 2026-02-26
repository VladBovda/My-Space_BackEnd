import { WebSocketGateway,WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import {Server, Socket} from "socket.io";

@WebSocketGateway({namespace: 'notifications', cors: {origin: '*'}})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() 
    server!: Server;

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('newExhibit')
    notifyNewExhibit(data: {description: string, user: string}) {
        this.server.emit('newExhibit', data);
    }
}

