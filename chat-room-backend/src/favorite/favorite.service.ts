/* eslint-disable */
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 收藏消息列表
  async favoriteList(userId: number) {
    const list = await this.prismaService.chatHistoryFavorite.findMany({
      where: {
        userId,
      },
    });

    const res: any[] = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const chatHistory = await this.prismaService.chatHistory.findUnique({
        where: {
          id: item.chatHistoryId,
        },
      });
      if (chatHistory) {
        res.push({
          ...item,
          chatHistory,
        });
      }
    }
    return res;
  }

  // 收藏
  async favoriteChat(userId: number, chatHistoryId: number) {
    return await this.prismaService.chatHistoryFavorite.create({
      data: {
        userId,
        chatHistoryId,
      },
      select: {
        id: true,
      },
    });
  }

  // 删除
  async delFavoriteChat(userId: number, chatHistoryId: number) {
    return await this.prismaService.chatHistoryFavorite.deleteMany({
      where: {
        userId,
        chatHistoryId,
      },
    });
  }
}
