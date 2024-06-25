import { IsInstance, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(5)
  login: string;

  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(5)
  password: string;

  image?: Express.Multer.File;
}
