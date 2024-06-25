import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  private clients = [];

  @SubscribeMessage('message')
  handleMessage(client, data) {
    switch (data.type) {
      case 'connection': {
        this.connectionHandler(data, client);
        break;
      }
      case 'message': {
        this.messageHandler(data);
        break;
      }
    }
  }

  handleConnection(client) {}

  handleDisconnect(client: any): any {
    this.clients = this.clients.filter((c) => c.socket.id !== client.id);
  }

  private connectionHandler(data: any, client: any) {
    if (!this.clients.find((c) => c.id === data.id)) {
      this.clients.push({
        id: data.id,
        socket: client,
      });
    }
    client.emit('message', JSON.stringify({ type: 'connection' }));
    console.log('connect');
  }

  private messageHandler(data: any) {
    this.clients.forEach((client) => {
      client.socket.emit('message', JSON.stringify(data));
    });
  }

  sendMessage(msg: any, clients?: string[]) {
    this.clients.forEach(({ id, socket }) => {
      if (clients) {
        if (clients.includes(id)) {
          socket.emit('message', JSON.stringify(msg));
        }
      } else {
        socket.emit('message', JSON.stringify(msg));
      }
    });
  }
}
