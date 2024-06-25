import { IsNotEmpty } from 'class-validator';

export class EditRoomDto {
  @IsNotEmpty()
  name: string;
}
