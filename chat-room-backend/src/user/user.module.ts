import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisModule } from 'src/redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth.guard';

@Module({
  imports: [RedisModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
