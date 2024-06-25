import { IsNotEmpty } from 'class-validator';

export class AddTodoDto {
  @IsNotEmpty()
  text: string;

  roomId?: string;
}
