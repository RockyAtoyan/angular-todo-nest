import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
  registration(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: RegistrationDto,
  ) {
    return this.authService.registration(dto, file);
  }

  @Post('/login')
  login(@Res() res: Response, @Body() dto: LoginDto) {
    return this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('/refresh')
  auth(@Req() req: Request, @Res() res: Response) {
    return this.authService.auth(req, res);
  }
}
