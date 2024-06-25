"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let SocketService = class SocketService {
    constructor() {
        this.clients = [];
    }
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
    handleConnection(client) { }
    handleDisconnect(client) {
        this.clients = this.clients.filter((c) => c.socket.id !== client.id);
    }
    connectionHandler(data, client) {
        if (!this.clients.find((c) => c.id === data.id)) {
            this.clients.push({
                id: data.id,
                socket: client,
            });
        }
        client.emit('message', JSON.stringify({ type: 'connection' }));
        console.log('connect');
    }
    messageHandler(data) {
        this.clients.forEach((client) => {
            client.socket.emit('message', JSON.stringify(data));
        });
    }
    sendMessage(msg, clients) {
        this.clients.forEach(({ id, socket }) => {
            if (clients) {
                if (clients.includes(id)) {
                    socket.emit('message', JSON.stringify(msg));
                }
            }
            else {
                socket.emit('message', JSON.stringify(msg));
            }
        });
    }
};
exports.SocketService = SocketService;
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SocketService.prototype, "handleMessage", null);
exports.SocketService = SocketService = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], SocketService);
//# sourceMappingURL=socket.service.js.map