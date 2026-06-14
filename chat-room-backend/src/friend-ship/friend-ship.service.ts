/* eslint-disable */

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFriendDto } from './dto/add-friend.dto';

@Injectable()
export class FriendShipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  async getFriendShip(userId: number, nickName: string) {
    // 从好友关系表中查询本人和添加本人好友的所以好友id
    const list = await this.prismaService.friendShip.findMany({
      where: {
        OR: [
          {
            userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });
    // 去重排除自身以外的好友id，得出所有好友id
    const set = new Set();
    for (let i = 0; i < list.length; i++) {
      set.add(list[i].userId);
      set.add(list[i].friendId);
    }
    const friendIds = Array.from(set).filter((id) => id !== userId);

    const res: any[] = [];
    // 遍历好友id，从用户表中查询好友信息
    for (let i = 0; i < friendIds.length; i++) {
      let where: any = {
        id: friendIds[i] as number,
      };
      if (nickName) {
        where.nickName = {
          contains: nickName,
        };
      }
      const user = await this.prismaService.user.findUnique({
        where,
        select: {
          id: true,
          username: true,
          nickName: true,
          headPic: true,
        },
      });
      if (user) {
        res.push(user);
      }
    }
    return res;
  }
  // 添加好友，从用户表中查询添加的好友是否存在校验，以及是否为本人校验，然后再用户关系表中查询是否已经存在，如果都校验通过就在好友关系表中入库，toUserId是添加的好友id，fromUserId是本人id，定义状态为0，等待同意
  async addFriend(userId: number, data: AddFriendDto) {
    // 通过username查询用户

    const toUserInfo = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!toUserInfo) {
      throw new UnauthorizedException('用户不存在');
    }

    if (toUserInfo.id === userId) {
      throw new UnauthorizedException('不能添加自己为好友');
    }

    // 检查是否已添加为好友
    const friendShip = await this.prismaService.friendShip.findMany({
      where: {
        userId,
        friendId: toUserInfo.id,
      },
    });

    if (friendShip.length) {
      throw new UnauthorizedException('已添加为好友');
    }
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: toUserInfo.id,
        reason: data.reason,
        status: 0,
      },
      select: {
        id: true,
      },
    });
  }

  // 从好友申请表找那个查询fromUserId为本人的和toUserId为本人的，也就是收到的和发送的好友请求，状态为0等待同意，然后从用户表中查询好友信息组装数据
  async getFriendRequestList(userId: number) {
    const fromMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });

    const toMeRequest = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
        status: 0,
      },
    });

    // 处理发给别人的请求
    const fromMePromises = fromMeRequest.map(async (item) => {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: item.toUserId,
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          headPic: true,
          createTime: true,
          email: true,
        },
      });
      return {
        ...item,
        toUser: user,
      };
    });

    // 处理收到的请求
    const toMePromises = toMeRequest.map(async (item) => {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: item.fromUserId,
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          headPic: true,
          createTime: true,
          email: true,
        },
      });
      return {
        ...item,
        fromUser: user,
      };
    });

    const fromMe = await Promise.all(fromMePromises);
    const toMe = await Promise.all(toMePromises);

    return {
      fromMe,
      toMe,
    };
  }
  // 同意就是通过关联关系以及状态，修改状态为1，然后在好友关系表中添加好友关系
  async agreeFrendRequest(friendId: number, userId: number) {
    console.log(friendId, userId, 'friendId, userId');
    await this.prismaService.friendRequest.updateMany({
      where: {
        toUserId: userId,
        fromUserId: friendId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });

    const res = await this.prismaService.friendShip.findMany({
      where: {
        userId,
        friendId,
      },
    });

    if (!res.length) {
      await this.prismaService.friendShip.create({
        data: {
          userId,
          friendId,
        },
      });
    }

    return {
      message: 'agree friend request success',
    };
  }
  // 拒绝好友请求，就是通过关联关系以及状态，修改状态为2，但是不用在好友关系表中添加好友关系
  async rejectFriendRequest(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        toUserId: friendId,
        fromUserId: userId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });
  }

  // 删除好友，就是从好友关系表中删除好友关系
  async deleteFriend(userId: number, friendId: number) {
    await this.prismaService.friendShip.deleteMany({
      where: {
        userId,
        friendId,
      },
    });
    return 'delete friend success';
  }
}
