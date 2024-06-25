import { IsNotEmpty } from 'class-validator';

export class AddTaskDto {
  @IsNotEmpty()
  text: string;

  deadline?: string;
}
