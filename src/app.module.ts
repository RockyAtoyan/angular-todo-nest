import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { LibModule } from './lib/lib.module';
import { TodoModule } from './todo/todo.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [DbModule, AuthModule, LibModule, TodoModule, SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
