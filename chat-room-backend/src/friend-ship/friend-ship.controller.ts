/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FriendShipService } from './friend-ship.service';
import { RequiedLogin, UserInfo } from 'src/custom.decorator';
import { AddFriendDto } from './dto/add-friend.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('好友管理')
@Controller('friend-ship')
export class FriendShipController {
  constructor(private readonly friendShipService: FriendShipService) {}

  @Get('list')
  @RequiedLogin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取好友列表' })
  @ApiQuery({ name: 'nickName', description: '昵称（可选）', required: false })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async friendShip(
    @Query('nickName') nickName: string,
    @UserInfo('userId') userId: number,
  ) {
    return await this.friendShipService.getFriendShip(userId, nickName);
  }

  @Post('add')
  @RequiedLogin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '添加好友' })
  @ApiResponse({ status: 200, description: '添加成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async addFriend(
    @UserInfo('userId') userId: number,
    @Body() data: AddFriendDto,
  ) {
    return await this.friendShipService.addFriend(userId, data);
  }

  @Get('request-list')
  @RequiedLogin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取好友请求列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async friendRequestList(@UserInfo('userId') userId: number) {
    return await this.friendShipService.getFriendRequestList(userId);
  }

  @Post('agree')
  @RequiedLogin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '同意好友请求' })
  @ApiResponse({ status: 200, description: '操作成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async agreeFriendRequest(
    @UserInfo('userId') userId: number,
    @Body() data: { friendId: number },
  ) {
    return await this.friendShipService.agreeFrendRequest(
      data.friendId,
      userId,
    );
  }

  @Post('reject')
  @RequiedLogin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '拒绝好友请求' })
  @ApiResponse({ status: 200, description: '操作成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async rejectFriendRequest(
    @UserInfo('userId') userId: number,
    @Body() data: { friendId: number },
  ) {
    return await this.friendShipService.rejectFriendRequest(
      data.friendId,
      userId,
    );
  }

  @Get('delete/:friendId')
  @RequiedLogin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '删除好友' })
  @ApiParam({ name: 'friendId', description: '好友ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async deleteFriend(
    @UserInfo('userId') userId: number,
    @Param('friendId') friendId: number,
  ) {
    return await this.friendShipService.deleteFriend(userId, friendId);
  }
}
