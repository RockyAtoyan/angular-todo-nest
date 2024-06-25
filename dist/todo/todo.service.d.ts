import { DbService } from '../db/db.service';
import { AddTodoDto } from './dto/add-todo.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { EditRoomDto } from './dto/edit-room.dto';
import { SocketService } from '../socket/socket.service';
export declare class TodoService {
    private prisma;
    private socket;
    constructor(prisma: DbService, socket: SocketService);
    getTodos(id: string): Promise<({
        tasks: {
            id: string;
            text: string;
            createdAt: Date;
            updatedAt: Date;
            isDone: boolean;
            deadline: Date;
            todoId: string;
            order: number;
        }[];
    } & {
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    })[]>;
    getUsers(search?: string): Promise<{
        id: string;
        login: string;
        password: string;
        image: string;
    }[]>;
    addTodo(userId: string, dto: AddTodoDto): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    }>;
    updateTodo(id: string, dto: UpdateTodoDto): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    }>;
    deleteTodo(id: string): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    }>;
    addTask(todoId: string, dto: AddTaskDto): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        isDone: boolean;
        deadline: Date;
        todoId: string;
        order: number;
    }>;
    updateTask(id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        isDone: boolean;
        deadline: Date;
        todoId: string;
        order: number;
    }>;
    deleteTask(id: string): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        isDone: boolean;
        deadline: Date;
        todoId: string;
        order: number;
    }>;
    changeTodoOrder(draggedId: string, dropId: string): Promise<boolean>;
    changeTaskOrder(draggedId: string, dropId: string): Promise<boolean>;
    pushTaskToTodo(taskId: string, todoId: string, prevTodoId: string, order?: number, dropTaskId?: string, direction?: 'bottom' | 'top'): Promise<boolean>;
    getRoom(userId: string, id: string): Promise<{
        isAdmin: boolean;
        users: {
            id: string;
            login: string;
            password: string;
            image: string;
        }[];
        todos: ({
            user: {
                id: string;
                login: string;
                password: string;
                image: string;
            };
            tasks: ({
                todo: {
                    id: string;
                    text: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    order: number;
                    roomId: string;
                };
            } & {
                id: string;
                text: string;
                createdAt: Date;
                updatedAt: Date;
                isDone: boolean;
                deadline: Date;
                todoId: string;
                order: number;
            })[];
        } & {
            id: string;
            text: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            order: number;
            roomId: string;
        })[];
        admin: {
            id: string;
            login: string;
            password: string;
            image: string;
        };
        id: string;
        name: string;
        userId: string;
    }>;
    createRoom(dto: CreateRoomDto, userId: string): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    deleteRoom(userId: string, id: string): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    editRoom(roomId: string, userId: string, dto: EditRoomDto): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    addUserToRoom(authUserId: string, userId: string, roomId: string): Promise<{
        room: {
            admin: {
                id: string;
                login: string;
                password: string;
                image: string;
            };
        } & {
            id: string;
            name: string;
            userId: string;
        };
    } & {
        id: string;
        roomId: string;
        invitedId: string;
        createdAt: Date;
    }>;
    acceptInviteToRoom(userId: string, roomId: string): Promise<{
        users: {
            id: string;
            login: string;
            password: string;
            image: string;
        }[];
    } & {
        id: string;
        name: string;
        userId: string;
    }>;
    rejectInviteToRoom(userId: string, roomId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    removeUserFromRoom(authUserId: string, userId: string, roomId: string): Promise<{
        users: {
            id: string;
            login: string;
            password: string;
            image: string;
        }[];
    } & {
        id: string;
        name: string;
        userId: string;
    }>;
    leaveRoom(user: {
        login: string;
        id: string;
    }, roomId: string): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    private isAdminOfRoom;
}
