import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AddTodoDto } from './dto/add-todo.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { EditRoomDto } from './dto/edit-room.dto';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class TodoService {
  constructor(
    private prisma: DbService,
    private socket: SocketService,
  ) {}

  async getTodos(id: string) {
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
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getUsers(search?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        login: {
          contains: search || '',
        },
      },
    });
    return users;
  }

  async addTodo(userId: string, dto: AddTodoDto) {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          text: dto.text,
          userId,
          roomId: dto.roomId || null,
        },
      });
      return todo;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async updateTodo(id: string, dto: UpdateTodoDto) {
    try {
      const todo = await this.prisma.todo.update({
        where: { id },
        data: {
          text: dto.text,
        },
      });
      return todo;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async deleteTodo(id: string) {
    try {
      const todo = await this.prisma.todo.delete({
        where: { id },
      });
      return todo;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async addTask(todoId: string, dto: AddTaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: {
          text: dto.text,
          todoId,
          deadline: dto.deadline ? new Date(dto.deadline) : null,
        },
      });
      return task;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
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
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async deleteTask(id: string) {
    try {
      const task = await this.prisma.task.delete({
        where: { id },
      });
      return task;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async changeTodoOrder(draggedId: string, dropId: string) {
    const draggedTodo = await this.prisma.todo.findUnique({
      where: { id: draggedId },
    });
    const dropTodo = await this.prisma.todo.findUnique({
      where: { id: dropId },
    });
    if (!draggedTodo || !dropTodo) {
      throw new NotFoundException('no todos!');
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

  async changeTaskOrder(draggedId: string, dropId: string) {
    const draggedTask = await this.prisma.task.findUnique({
      where: { id: draggedId },
    });
    const dropTask = await this.prisma.task.findUnique({
      where: { id: dropId },
    });
    if (!draggedTask || !dropTask) {
      throw new NotFoundException('no tasks!');
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

  async pushTaskToTodo(
    taskId: string,
    todoId: string,
    prevTodoId: string,
    order?: number,
    dropTaskId?: string,
    direction?: 'bottom' | 'top',
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException();
    }
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
      include: {
        tasks: true,
      },
    });
    if (!todo) {
      throw new NotFoundException();
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
      throw new NotFoundException();
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

  async getRoom(userId: string, id: string) {
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
    if (
      !room ||
      (room?.admin?.id !== userId &&
        room?.users.every((user) => user.id !== userId))
    ) {
      throw new NotFoundException();
    }
    return { ...room, isAdmin: room.admin.id === userId };
  }

  async createRoom(dto: CreateRoomDto, userId: string) {
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

  async deleteRoom(userId: string, id: string) {
    if (!(await this.isAdminOfRoom(id, userId))) {
      throw new BadRequestException('You are not admin!');
    }
    const room = await this.prisma.room.delete({
      where: { id },
    });
    return room;
  }

  async editRoom(roomId: string, userId: string, dto: EditRoomDto) {
    if (!(await this.isAdminOfRoom(roomId, userId))) {
      throw new BadRequestException('You are not admin!');
    }
    const room = await this.prisma.room.update({
      where: { id: roomId },
      data: {
        name: dto.name,
      },
    });
    return room;
  }

  async addUserToRoom(authUserId: string, userId: string, roomId: string) {
    if (!(await this.isAdminOfRoom(roomId, authUserId))) {
      throw new BadRequestException('You are not admin!');
    }
    const isExist = await this.prisma.order.findFirst({
      where: {
        invitedId: userId,
        roomId,
      },
    });
    if (isExist) {
      throw new BadRequestException('Invite is already sent!');
    }
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        users: true,
      },
    });
    if (!room) {
      throw new NotFoundException('');
    }
    if (room.users.find((user) => user.id === userId)) {
      throw new BadRequestException('User is already in room!');
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
    this.socket.sendMessage(
      {
        type: 'message',
        data: `${order.room.admin.login} invites you ro room!`,
      },
      [userId],
    );
    // const room = await this.prisma.room.update({
    //   where: { id: roomId },
    //   data: {
    //     users: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //   },
    // });
    return order;
  }

  async acceptInviteToRoom(userId: string, roomId: string) {
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
    this.socket.sendMessage(
      {
        type: 'message',
        data: `${room.users.find((user) => user.id === userId).login} join the room "${room.name}"!`,
      },
      [room.userId],
    );
    return room;
  }

  async rejectInviteToRoom(userId: string, roomId: string) {
    const order = await this.prisma.order.deleteMany({
      where: {
        invitedId: userId,
        roomId,
      },
    });
    return order;
  }

  async removeUserFromRoom(authUserId: string, userId: string, roomId: string) {
    if (!(await this.isAdminOfRoom(roomId, authUserId))) {
      throw new BadRequestException('You are not admin!');
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

  async leaveRoom(user: { login: string; id: string }, roomId: string) {
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
    this.socket.sendMessage(
      {
        type: 'message',
        data: `${user.login} left room "${room.name}"!`,
      },
      [room.userId],
    );
    return room;
  }

  private async isAdminOfRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    return room.userId === userId;
  }
}
