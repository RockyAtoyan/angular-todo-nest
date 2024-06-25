import { IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  text: string;

  isDone?: boolean;

  deadline?: string;
}
