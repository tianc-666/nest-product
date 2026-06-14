/* eslint-disable */
import { Controller, Get, Query } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}
  // 查询chat-history表中的数据，根据聊天室id查询出所有的聊天记录
  @Get('list')
  async list(@Query('chatroomId') chatroomId: number) {
    return await this.chatHistoryService.chatHistoryList(chatroomId);
  }
}
