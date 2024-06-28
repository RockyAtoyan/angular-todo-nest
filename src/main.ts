import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

const frontUrl = ['https://angular-todo-2fa64.web.app', "http://localhost:3000", "http://localhost:4200"];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: frontUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
