import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatroomController],
  providers: [
    ChatroomService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ChatroomModule {}
