import { IsNotEmpty } from 'class-validator';

export class PushTaskDto {
  @IsNotEmpty()
  taskId: string;

  dropTaskId?: string;
  direction?: 'bottom' | 'top';
  order?: number;

  @IsNotEmpty()
  prevTodoId: string;
}
