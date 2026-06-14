/* eslint-disable */

import { Inject, Injectable } from '@nestjs/common';
import { ChatHistoryCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';

// 查询和新增
@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  // 查询chat-history表中的数据，根据聊天室id查询出所有的聊天记录，然后根据发送人id查询出发送人详细信息
  async chatHistoryList(chatroomId: number) {
    const chatHistoryList = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId: Number(chatroomId),
      },
    });

    const res: any[] = [];
    for (let i = 0; i < chatHistoryList.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: chatHistoryList[i].senderId,
        },
        select: {
          id: true,
          username: true,
          headPic: true,
          email: true,
          createTime: true,
          nickName: true,
        },
      });
      res.push({
        ...chatHistoryList[i],
        sendUserInfo: user,
      });
    }
    return res;
  }
  // 新增chat-history表中的数据，根据发送人id，聊天室id，消息类型，消息内容新增一条记录
  async addChatHistory(chatHistory: ChatHistoryCreateInput) {
    return await this.prismaService.chatHistory.create({
      data: chatHistory,
    });
  }
}
