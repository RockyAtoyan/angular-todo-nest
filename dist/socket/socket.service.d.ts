import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
export declare class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
    private clients;
    handleMessage(client: any, data: any): void;
    handleConnection(client: any): void;
    handleDisconnect(client: any): any;
    private connectionHandler;
    private messageHandler;
    sendMessage(msg: any, clients?: string[]): void;
}
