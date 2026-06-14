import { Module } from '@nestjs/common';
import { FriendShipService } from './friend-ship.service';
import { FriendShipController } from './friend-ship.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [FriendShipController],
  providers: [
    FriendShipService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class FriendShipModule {}
