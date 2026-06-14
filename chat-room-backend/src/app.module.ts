import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { FriendShipModule } from './friend-ship/friend-ship.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MinioModule } from './minio/minio.module';
import { ChatModule } from './chat/chat.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    EmailModule,
    RedisModule,
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: 'wang',
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
    FriendShipModule,
    ChatroomModule,
    MinioModule,
    ChatModule,
    ChatHistoryModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
