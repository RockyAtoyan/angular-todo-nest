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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const common_1 = require("@nestjs/common");
const todo_service_1 = require("./todo.service");
const add_todo_dto_1 = require("./dto/add-todo.dto");
const auth_guard_1 = require("../auth/auth.guard");
const update_todo_dto_1 = require("./dto/update-todo.dto");
const add_task_dto_1 = require("./dto/add-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const push_task_dto_1 = require("./dto/push-task.dto");
const create_room_dto_1 = require("./dto/create-room.dto");
const edit_room_dto_1 = require("./dto/edit-room.dto");
let TodoController = class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    getTodos(req) {
        return this.todoService.getTodos(req.user.id);
    }
    getUsers(search) {
        return this.todoService.getUsers(search);
    }
    addTodo(dto, req) {
        return this.todoService.addTodo(req.user.id, dto);
    }
    updateTodo(dto, id) {
        return this.todoService.updateTodo(id, dto);
    }
    deleteTodo(id) {
        return this.todoService.deleteTodo(id);
    }
    changeTodoOrder(draggedId, dropId) {
        return this.todoService.changeTodoOrder(draggedId, dropId);
    }
    createRoom(req, dto) {
        return this.todoService.createRoom(dto, req.user.id);
    }
    addTask(dto, todoId) {
        return this.todoService.addTask(todoId, dto);
    }
    updateTask(dto, id) {
        return this.todoService.updateTask(id, dto);
    }
    deleteTask(id) {
        return this.todoService.deleteTask(id);
    }
    changeTaskOrder(draggedId, dropId) {
        return this.todoService.changeTaskOrder(draggedId, dropId);
    }
    pushTaskToTodo(todoId, dto) {
        return this.todoService.pushTaskToTodo(dto.taskId, todoId, dto.prevTodoId, dto.order, dto.dropTaskId, dto.direction);
    }
    getRoom(req, roomId) {
        return this.todoService.getRoom(req.user.id, roomId);
    }
    editRoom(req, dto, roomId) {
        return this.todoService.editRoom(roomId, req.user.id, dto);
    }
    deleteRoom(req, roomId) {
        return this.todoService.deleteRoom(req.user.id, roomId);
    }
    addUserToRoom(req, roomId, userId) {
        return this.todoService.addUserToRoom(req.user.id, userId, roomId);
    }
    acceptInviteToRoom(roomId, userId) {
        return this.todoService.acceptInviteToRoom(userId, roomId);
    }
    rejectInviteToRoom(roomId, userId) {
        return this.todoService.rejectInviteToRoom(userId, roomId);
    }
    removeUserToRoom(req, roomId, userId) {
        return this.todoService.removeUserFromRoom(req.user.id, userId, roomId);
    }
    leaveRoom(req, roomId) {
        return this.todoService.leaveRoom(req.user, roomId);
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "getTodos", null);
__decorate([
    (0, common_1.Get)('/users'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_todo_dto_1.AddTodoDto, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "addTodo", null);
__decorate([
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_todo_dto_1.UpdateTodoDto, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "updateTodo", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "deleteTodo", null);
__decorate([
    (0, common_1.Get)('/:id/order/:dropId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "changeTodoOrder", null);
__decorate([
    (0, common_1.Post)('/room'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_task_dto_1.AddTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "addTask", null);
__decorate([
    (0, common_1.Put)('/task/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('/task/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)('/task/:id/order/:dropId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dropId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "changeTaskOrder", null);
__decorate([
    (0, common_1.Put)('/task/push/:todoId'),
    __param(0, (0, common_1.Param)('todoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, push_task_dto_1.PushTaskDto]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "pushTaskToTodo", null);
__decorate([
    (0, common_1.Get)('/room/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "getRoom", null);
__decorate([
    (0, common_1.Put)('/room/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_room_dto_1.EditRoomDto, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "editRoom", null);
__decorate([
    (0, common_1.Delete)('/room/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "deleteRoom", null);
__decorate([
    (0, common_1.Put)('/room/:id/add/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "addUserToRoom", null);
__decorate([
    (0, common_1.Post)('/room/:id/accept/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "acceptInviteToRoom", null);
__decorate([
    (0, common_1.Post)('/room/:id/reject/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "rejectInviteToRoom", null);
__decorate([
    (0, common_1.Put)('/room/:id/remove/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "removeUserToRoom", null);
__decorate([
    (0, common_1.Put)('/room/:id/leave'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "leaveRoom", null);
exports.TodoController = TodoController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('todo'),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoController);
//# sourceMappingURL=todo.controller.js.map