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
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
const socket_service_1 = require("../socket/socket.service");
let TodoService = class TodoService {
    constructor(prisma, socket) {
        this.prisma = prisma;
        this.socket = socket;
    }
    async getTodos(id) {
        try {
            const todos = await this.prisma.todo.findMany({
                where: { userId: id, roomId: null },
                orderBy: {
                    order: 'desc',
                },
                include: {
                    tasks: {
                        orderBy: {
                            order: 'desc',
                        },
                    },
                },
            });
            return todos;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async getUsers(search) {
        const users = await this.prisma.user.findMany({
            where: {
                login: {
                    contains: search || '',
                },
            },
        });
        return users;
    }
    async addTodo(userId, dto) {
        try {
            const todo = await this.prisma.todo.create({
                data: {
                    text: dto.text,
                    userId,
                    roomId: dto.roomId || null,
                },
            });
            return todo;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async updateTodo(id, dto) {
        try {
            const todo = await this.prisma.todo.update({
                where: { id },
                data: {
                    text: dto.text,
                },
            });
            return todo;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async deleteTodo(id) {
        try {
            const todo = await this.prisma.todo.delete({
                where: { id },
            });
            return todo;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async addTask(todoId, dto) {
        try {
            const task = await this.prisma.task.create({
                data: {
                    text: dto.text,
                    todoId,
                    deadline: dto.deadline ? new Date(dto.deadline) : null,
                },
            });
            return task;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async updateTask(id, dto) {
        try {
            const task = await this.prisma.task.update({
                where: { id },
                data: {
                    text: dto.text,
                    isDone: dto.isDone,
                    deadline: dto.deadline,
                },
            });
            return task;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async deleteTask(id) {
        try {
            const task = await this.prisma.task.delete({
                where: { id },
            });
            return task;
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async changeTodoOrder(draggedId, dropId) {
        const draggedTodo = await this.prisma.todo.findUnique({
            where: { id: draggedId },
        });
        const dropTodo = await this.prisma.todo.findUnique({
            where: { id: dropId },
        });
        if (!draggedTodo || !dropTodo) {
            throw new common_1.NotFoundException('no todos!');
        }
        const tempOrder = draggedTodo.order;
        await this.prisma.todo.update({
            where: { id: draggedTodo.id },
            data: { order: dropTodo.order },
        });
        await this.prisma.todo.update({
            where: { id: dropTodo.id },
            data: { order: tempOrder },
        });
        return true;
    }
    async changeTaskOrder(draggedId, dropId) {
        const draggedTask = await this.prisma.task.findUnique({
            where: { id: draggedId },
        });
        const dropTask = await this.prisma.task.findUnique({
            where: { id: dropId },
        });
        if (!draggedTask || !dropTask) {
            throw new common_1.NotFoundException('no tasks!');
        }
        const tempOrder = draggedTask.order;
        await this.prisma.task.update({
            where: { id: draggedTask.id },
            data: { order: dropTask.order },
        });
        await this.prisma.task.update({
            where: { id: dropTask.id },
            data: { order: tempOrder },
        });
        return true;
    }
    async pushTaskToTodo(taskId, todoId, prevTodoId, order, dropTaskId, direction) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task) {
            throw new common_1.NotFoundException();
        }
        const todo = await this.prisma.todo.findUnique({
            where: { id: todoId },
            include: {
                tasks: true,
            },
        });
        if (!todo) {
            throw new common_1.NotFoundException();
        }
        await this.prisma.todo.update({
            where: { id: todoId },
            data: {
                tasks: {
                    connect: {
                        id: taskId,
                    },
                },
            },
        });
        if (!dropTaskId) {
            return true;
        }
        const dropTask = await this.prisma.task.findUnique({
            where: { id: dropTaskId },
        });
        if (!dropTask) {
            throw new common_1.NotFoundException();
        }
        const tasks = todo.tasks.filter((task) => {
            return task.order < dropTask.order;
        });
        for (let i = 0; i < tasks.length; i++) {
            await this.prisma.task.update({
                where: { id: tasks[i].id },
                data: {
                    order: {
                        decrement: 1,
                    },
                },
            });
        }
        if (direction === 'top') {
            await this.prisma.task.update({
                where: { id: dropTask.id },
                data: {
                    order: {
                        decrement: 1,
                    },
                },
            });
        }
        await this.prisma.task.update({
            where: { id: taskId },
            data: {
                order: direction === 'top' ? dropTask.order + 1 : dropTask.order - 1,
            },
        });
        return true;
    }
    async getRoom(userId, id) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: {
                todos: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        tasks: {
                            orderBy: {
                                order: 'desc',
                            },
                            include: {
                                todo: true,
                            },
                        },
                        user: true,
                    },
                },
                admin: true,
                users: true,
            },
        });
        if (!room ||
            (room?.admin?.id !== userId &&
                room?.users.every((user) => user.id !== userId))) {
            throw new common_1.NotFoundException();
        }
        return { ...room, isAdmin: room.admin.id === userId };
    }
    async createRoom(dto, userId) {
        const room = await this.prisma.room.create({
            data: {
                name: dto.name,
                admin: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return room;
    }
    async deleteRoom(userId, id) {
        if (!(await this.isAdminOfRoom(id, userId))) {
            throw new common_1.BadRequestException('You are not admin!');
        }
        const room = await this.prisma.room.delete({
            where: { id },
        });
        return room;
    }
    async editRoom(roomId, userId, dto) {
        if (!(await this.isAdminOfRoom(roomId, userId))) {
            throw new common_1.BadRequestException('You are not admin!');
        }
        const room = await this.prisma.room.update({
            where: { id: roomId },
            data: {
                name: dto.name,
            },
        });
        return room;
    }
    async addUserToRoom(authUserId, userId, roomId) {
        if (!(await this.isAdminOfRoom(roomId, authUserId))) {
            throw new common_1.BadRequestException('You are not admin!');
        }
        const isExist = await this.prisma.order.findFirst({
            where: {
                invitedId: userId,
                roomId,
            },
        });
        if (isExist) {
            throw new common_1.BadRequestException('Invite is already sent!');
        }
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: {
                users: true,
            },
        });
        if (!room) {
            throw new common_1.NotFoundException('');
        }
        if (room.users.find((user) => user.id === userId)) {
            throw new common_1.BadRequestException('User is already in room!');
        }
        const order = await this.prisma.order.create({
            data: {
                invitedId: userId,
                roomId,
            },
            include: {
                room: {
                    include: {
                        admin: true,
                    },
                },
            },
        });
        this.socket.sendMessage({
            type: 'message',
            data: `${order.room.admin.login} invites you ro room!`,
        }, [userId]);
        return order;
    }
    async acceptInviteToRoom(userId, roomId) {
        const order = await this.prisma.order.deleteMany({
            where: {
                invitedId: userId,
                roomId,
            },
        });
        const room = await this.prisma.room.update({
            where: { id: roomId },
            data: {
                users: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                users: true,
            },
        });
        this.socket.sendMessage({
            type: 'message',
            data: `${room.users.find((user) => user.id === userId).login} join the room "${room.name}"!`,
        }, [room.userId]);
        return room;
    }
    async rejectInviteToRoom(userId, roomId) {
        const order = await this.prisma.order.deleteMany({
            where: {
                invitedId: userId,
                roomId,
            },
        });
        return order;
    }
    async removeUserFromRoom(authUserId, userId, roomId) {
        if (!(await this.isAdminOfRoom(roomId, authUserId))) {
            throw new common_1.BadRequestException('You are not admin!');
        }
        const room = await this.prisma.room.update({
            where: { id: roomId },
            data: {
                users: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
            include: {
                users: true,
            },
        });
        return room;
    }
    async leaveRoom(user, roomId) {
        const room = await this.prisma.room.update({
            where: { id: roomId },
            data: {
                users: {
                    disconnect: {
                        id: user.id,
                    },
                },
            },
        });
        this.socket.sendMessage({
            type: 'message',
            data: `${user.login} left room "${room.name}"!`,
        }, [room.userId]);
        return room;
    }
    async isAdminOfRoom(roomId, userId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
        });
        return room.userId === userId;
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        socket_service_1.SocketService])
], TodoService);
//# sourceMappingURL=todo.service.js.map