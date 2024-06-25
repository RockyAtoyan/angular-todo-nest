import { TodoService } from './todo.service';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PushTaskDto } from './dto/push-task.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { EditRoomDto } from './dto/edit-room.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    getTodos(req: any): Promise<({
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
    getUsers(search: any): Promise<{
        id: string;
        login: string;
        password: string;
        image: string;
    }[]>;
    addTodo(dto: AddTodoDto, req: any): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    }>;
    updateTodo(dto: UpdateTodoDto, id: any): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    }>;
    deleteTodo(id: any): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        order: number;
        roomId: string;
    }>;
    changeTodoOrder(draggedId: any, dropId: any): Promise<boolean>;
    createRoom(req: any, dto: CreateRoomDto): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    addTask(dto: AddTaskDto, todoId: any): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        isDone: boolean;
        deadline: Date;
        todoId: string;
        order: number;
    }>;
    updateTask(dto: UpdateTaskDto, id: any): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        isDone: boolean;
        deadline: Date;
        todoId: string;
        order: number;
    }>;
    deleteTask(id: any): Promise<{
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
        isDone: boolean;
        deadline: Date;
        todoId: string;
        order: number;
    }>;
    changeTaskOrder(draggedId: any, dropId: any): Promise<boolean>;
    pushTaskToTodo(todoId: any, dto: PushTaskDto): Promise<boolean>;
    getRoom(req: any, roomId: any): Promise<{
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
    editRoom(req: any, dto: EditRoomDto, roomId: any): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    deleteRoom(req: any, roomId: any): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
    addUserToRoom(req: any, roomId: any, userId: any): Promise<{
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
    acceptInviteToRoom(roomId: any, userId: any): Promise<{
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
    rejectInviteToRoom(roomId: any, userId: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    removeUserToRoom(req: any, roomId: any, userId: any): Promise<{
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
    leaveRoom(req: any, roomId: any): Promise<{
        id: string;
        name: string;
        userId: string;
    }>;
}
