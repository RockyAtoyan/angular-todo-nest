import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { AddTodoDto } from './dto/add-todo.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PushTaskDto } from './dto/push-task.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { EditRoomDto } from './dto/edit-room.dto';

@UseGuards(AuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  getTodos(@Req() req) {
    return this.todoService.getTodos(req.user.id);
  }

  @Get('/users')
  getUsers(@Query('search') search) {
    return this.todoService.getUsers(search);
  }

  @Post('/')
  addTodo(@Body() dto: AddTodoDto, @Req() req) {
    return this.todoService.addTodo(req.user.id, dto);
  }

  @Put('/:id')
  updateTodo(@Body() dto: UpdateTodoDto, @Param('id') id) {
    return this.todoService.updateTodo(id, dto);
  }

  @Delete('/:id')
  deleteTodo(@Param('id') id) {
    return this.todoService.deleteTodo(id);
  }

  @Get('/:id/order/:dropId')
  changeTodoOrder(@Param('id') draggedId, @Param('id') dropId) {
    return this.todoService.changeTodoOrder(draggedId, dropId);
  }

  @Post('/room')
  createRoom(@Req() req, @Body() dto: CreateRoomDto) {
    return this.todoService.createRoom(dto, req.user.id);
  }

  @Post('/:id')
  addTask(@Body() dto: AddTaskDto, @Param('id') todoId) {
    return this.todoService.addTask(todoId, dto);
  }

  @Put('/task/:id')
  updateTask(@Body() dto: UpdateTaskDto, @Param('id') id) {
    return this.todoService.updateTask(id, dto);
  }

  @Delete('/task/:id')
  deleteTask(@Param('id') id) {
    return this.todoService.deleteTask(id);
  }

  @Get('/task/:id/order/:dropId')
  changeTaskOrder(@Param('id') draggedId, @Param('dropId') dropId) {
    return this.todoService.changeTaskOrder(draggedId, dropId);
  }

  @Put('/task/push/:todoId')
  pushTaskToTodo(@Param('todoId') todoId, @Body() dto: PushTaskDto) {
    return this.todoService.pushTaskToTodo(
      dto.taskId,
      todoId,
      dto.prevTodoId,
      dto.order,
      dto.dropTaskId,
      dto.direction,
    );
  }

  @Get('/room/:id')
  getRoom(@Req() req, @Param('id') roomId) {
    return this.todoService.getRoom(req.user.id, roomId);
  }

  @Put('/room/:id')
  editRoom(@Req() req, @Body() dto: EditRoomDto, @Param('id') roomId) {
    return this.todoService.editRoom(roomId, req.user.id, dto);
  }

  @Delete('/room/:id')
  deleteRoom(@Req() req, @Param('id') roomId) {
    return this.todoService.deleteRoom(req.user.id, roomId);
  }

  @Put('/room/:id/add/:userId')
  addUserToRoom(@Req() req, @Param('id') roomId, @Param('userId') userId) {
    return this.todoService.addUserToRoom(req.user.id, userId, roomId);
  }

  @Post('/room/:id/accept/:userId')
  acceptInviteToRoom(@Param('id') roomId, @Param('userId') userId) {
    return this.todoService.acceptInviteToRoom(userId, roomId);
  }

  @Post('/room/:id/reject/:userId')
  rejectInviteToRoom(@Param('id') roomId, @Param('userId') userId) {
    return this.todoService.rejectInviteToRoom(userId, roomId);
  }

  @Put('/room/:id/remove/:userId')
  removeUserToRoom(@Req() req, @Param('id') roomId, @Param('userId') userId) {
    return this.todoService.removeUserFromRoom(req.user.id, userId, roomId);
  }

  @Put('/room/:id/leave')
  leaveRoom(@Req() req, @Param('id') roomId) {
    return this.todoService.leaveRoom(req.user, roomId);
  }
}
