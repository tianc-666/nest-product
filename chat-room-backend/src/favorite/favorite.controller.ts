/* eslint-disable */

import { Body, Controller, Get, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { RequiedLogin, UserInfo } from 'src/custom.decorator';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('list')
  @RequiedLogin()
  async getFavoriteList(@UserInfo('userId') userId: number) {
    return await this.favoriteService.favoriteList(userId);
  }

  @Post('add')
  @RequiedLogin()
  async addFavoriteChat(
    @UserInfo('userId') userId: number,
    @Body('chatHistoryId') chatHistoryId: number,
  ) {
    return await this.favoriteService.favoriteChat(userId, chatHistoryId);
  }

  @Post('del')
  @RequiedLogin()
  async delFavoriteChat(
    @UserInfo('userId') userId: number,
    @Body('chatHistoryId') chatHistoryId: number,
  ) {
    return await this.favoriteService.delFavoriteChat(userId, chatHistoryId);
  }
}
