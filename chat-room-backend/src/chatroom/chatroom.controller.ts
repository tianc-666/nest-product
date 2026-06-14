/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatRoomDto } from './dto/create-chartroom.dto';
import { RequiedLogin, UserInfo } from 'src/custom.decorator';
import { CHART_ROOM_TYPE } from './const';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}
  // 创建聊天室
  @Post('create')
  @RequiedLogin()
  async createChatRoom(
    @Body() data: CreateChatRoomDto,
    @UserInfo('userId') userId: number,
  ) {
    if (data.type === CHART_ROOM_TYPE['SINGLE'] && !data.friendId) {
      throw new BadRequestException('聊天好友的id不能为空');
    }

    return await this.chatroomService.createChatRoom(data, userId);
  }

  @Get('list')
  async getChatRoomList(
    @Query('name') name: string,
    @Query('type') type: number,
  ) {
    return await this.chatroomService.getChatRoomList(name, type);
  }

  @Delete('delete/:id')
  @RequiedLogin()
  async deleteChatRoom(@Param('id') id: number) {
    if (!id) {
      throw new UnauthorizedException('id不能为空');
    }
    return await this.chatroomService.deleteChatRoom(id);
  }

  @Get('join/:id')
  @RequiedLogin()
  async joinChatRoom(
    @Param('id') id: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!id) {
      throw new UnauthorizedException('请传入id');
    }
    return await this.chatroomService.joinChatRoom(id, userId);
  }

  @Post('add-member')
  @RequiedLogin()
  async addChatRoomMember(
    @Body() data: { chatroomId: number; friendNames: string },
    @UserInfo('userId') userId: number,
  ) {
    if (!data.chatroomId || !data.friendNames) {
      throw new BadRequestException('聊天室id和好友用户名不能为空');
    }
    return await this.chatroomService.addChatRoomMember(
      data.chatroomId,
      data.friendNames,
      userId,
    );
  }

  @Get('user-chatroom')
  @RequiedLogin()
  async getUserChatRoom(@UserInfo('userId') userId: number) {
    return await this.chatroomService.userChatRoomList(userId);
  }

  @Get('out-user-chatroom/:id')
  @RequiedLogin()
  async outChatRoom(
    @Param('id') id: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!id) {
      throw new UnauthorizedException('请输入id');
    }
    return await this.chatroomService.outChatRoom(id, userId);
  }

  @Get('members')
  @RequiedLogin()
  async getChatRoomMember(@Query('id') id: number) {
    return await this.chatroomService.getChatRoomMember(id);
  }

  @Get('chat-room-info')
  @RequiedLogin()
  async getChatRoomInfo(@Query('id') id: number) {
    return await this.chatroomService.getChatRoomInfo(id);
  }

  @Get('find-chat-room')
  @RequiedLogin()
  async findChatRoomId(
    @Query('friendId') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new BadRequestException('好友id不能为空');
    }
    return await this.chatroomService.findChatRoomId(friendId, userId);
  }

  @Get('is-join')
  @RequiedLogin()
  async isJoinChatRoom(
    @Query('chatRoomId') chatRoomId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!chatRoomId) {
      throw new BadRequestException('聊天室id不能为空');
    }
    return await this.chatroomService.isJoinChatRoom(chatRoomId, userId);
  }
}
