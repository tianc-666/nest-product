/* eslint-disable */

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chartroom.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CHART_ROOM_TYPE } from './const';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  // 创建chatroom，根据type判断是单聊还是群聊，如果是单聊就先创建一个chatroom，然后在userchatroom表中创建两个单聊用户的关联，群聊就直接创建一个chatroom，在userchatroom中创建当前userid的关联
  async createChatRoom(data: CreateChatRoomDto, userId: number) {
    if (data.type === CHART_ROOM_TYPE['SINGLE']) {
      const friendInfo = await this.prismaService.user.findUnique({
        where: {
          id: data.friendId,
        },
      });

      const { id } = await this.prismaService.chatRoom.create({
        data: {
          name: friendInfo?.nickName!,
          type: data.type,
        },
        select: {
          id: true,
        },
      });

      await this.prismaService.userChatRoom.create({
        data: {
          userId,
          chatRoomId: id,
        },
      });
      await this.prismaService.userChatRoom.create({
        data: {
          userId: data.friendId,
          chatRoomId: id,
        },
      });
      return id;
    } else {
      const { id } = await this.prismaService.chatRoom.create({
        data,
        select: {
          id: true,
        },
      });
      await this.prismaService.userChatRoom.create({
        data: {
          userId,
          chatRoomId: id,
        },
      });
      return id;
    }
  }
  // 获取聊天室列表，这里根据type拆分，如果传入type为单聊，就返回所有单聊房间，否则返回所有群聊房间
  // 这里 查询了两个表一个chatroom表和用户表，用户表是为了返回每个聊天室的用户列表
  async getChatRoomList(name: string, type: number) {
    const chartRoom = await this.prismaService.chatRoom.findMany({
      where: {
        type,
        name: {
          contains: name,
        },
      },
    });

    const res: any[] = [];

    for (let i = 0; i < chartRoom.length; i++) {
      const user = await this.getChatRoomMember(chartRoom[i].id);
      const userIds = user?.map((item) => item.id);
      res.push({
        ...chartRoom[i],
        userCount: userIds?.length,
        userIds,
      });
    }

    return res;
  }
  // 删除就是删除聊天室和里面的用户关联，因为这里没用连表，所以得手动删除
  async deleteChatRoom(id: number) {
    await this.prismaService.chatRoom.delete({
      where: {
        id,
      },
    });

    await this.prismaService.userChatRoom.deleteMany({
      where: {
        chatRoomId: id,
      },
    });
    return {
      message: 'delete chat room success',
    };
  }
  // 加入聊天室，判断是否是单聊房间，如果是单聊房间就抛出异常，否则就创建一个关联
  async joinChatRoom(id: number, userId: number) {
    const chatRoom = await this.prismaService.chatRoom.findUnique({
      where: {
        id,
      },
    });

    if (chatRoom?.type === CHART_ROOM_TYPE['SINGLE']) {
      throw new UnauthorizedException('不可加入单聊');
    }

    await this.prismaService.userChatRoom.create({
      data: {
        chatRoomId: id,
        userId,
      },
      select: {
        chatRoomId: true,
      },
    });
  }
  // 当前用户加入的聊天室列表，先从userchatroom表中查询当前用户加入的所有聊天室id，然后从chatroom表中查询这些聊天室的详细信息。以及user表中查询这些用户的详细信息
  async userChatRoomList(userId: number) {
    const findUserChatRoom = await this.prismaService.userChatRoom.findMany({
      where: {
        userId,
      },
      select: {
        chatRoomId: true,
      },
    });
    const chatRooms = await this.prismaService.chatRoom.findMany({
      where: {
        id: {
          in: findUserChatRoom?.map((item) => item.chatRoomId),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true,
      },
    });

    const res: any[] = [];
    for (let i = 0; i < chatRooms?.length; i++) {
      const user = await this.getChatRoomMember(chatRooms[i].id);
      const userIds = user?.map((item) => item.id);
      res.push({
        ...chatRooms[i],
        userCount: userIds?.length,
        userIds,
      });
    }
    return res;
  }
  // 退出聊天室，判断是否是单聊房间，如果是单聊房间就抛出异常，否则就删除userchatroom表中的关联
  async outChatRoom(id: number, userId: number) {
    const chartRoom = await this.getChatRoomInfo(id);

    if (chartRoom.type === CHART_ROOM_TYPE['SINGLE']) {
      throw new UnauthorizedException('单聊房间不可退出');
    }

    await this.prismaService.userChatRoom.deleteMany({
      where: {
        userId,
        chatRoomId: id,
      },
    });

    if (chartRoom.users?.length === 1) {
      await this.deleteChatRoom(id);
    }
    return {
      message: 'out chat room success',
    };
  }
  // 获取聊天室内的用户列表，先从userchatroom表中查询当前聊天室的所有用户id，然后从user表中查询这些用户的详细信息
  async getChatRoomMember(id: number) {
    const chatRooms = await this.prismaService.userChatRoom.findMany({
      where: {
        chatRoomId: id,
      },
    });
    const user = await this.userInfoByChatRooms(
      chatRooms?.map((item) => item.userId),
    );

    return user;
  }
  // 通过ids从user表中查询用户详细数据
  async userInfoByChatRooms(ids: number | number[]) {
    const userList = await this.prismaService.user.findMany({
      where: {
        id: {
          in: Array.isArray(ids) ? ids : [ids],
        },
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

    return userList;
  }

  // 通过id查询聊天室详细信息，包括聊天室的用户列表
  async getChatRoomInfo(roomId: number) {
    const chatRoom = await this.prismaService.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });

    return { ...chatRoom, users: await this.getChatRoomMember(roomId) };
  }
  //

  // 查询两个用户是否在一个聊天室，并且聊天类型为单聊从userchatroom表中查询出本人和点击的好友的id，查出交集，就是遍历本人的userchatroom然后从chatroom中筛选出单聊的，然后再去遍历好友的userchatroom，如果id相同，就是单聊存在)
  async findChatRoomId(friendId: number, userId: number) {
    // 查询两个用户是否在一个聊天室，并且聊天类型为单聊
    const friendChat = await this.prismaService.userChatRoom.findMany({
      where: {
        userId: friendId,
      },
    });

    const userChat = await this.prismaService.userChatRoom.findMany({
      where: {
        userId,
      },
    });
    let res: number | null = null;
    for (let i = 0; i < friendChat.length; i++) {
      const room = await this.prismaService.chatRoom.findFirst({
        where: {
          id: friendChat[i].chatRoomId,
        },
      });

      if (room?.type !== CHART_ROOM_TYPE['SINGLE']) {
        continue;
      }

      if (userChat.some((item) => item.chatRoomId === room.id)) {
        res = room.id;
      }
    }
    return res;
  }
  // 当前用户是否加入聊天室，从userchatroom表中查询出当前用户是否加入了该聊天室
  async isJoinChatRoom(chatRoomId: number, userId: number) {
    const isJoin = await this.prismaService.userChatRoom.findFirst({
      where: {
        chatRoomId,
        userId,
      },
      select: {
        chatRoomId: true,
      },
    });

    return isJoin || false;
  }

  async addChatRoomMember(
    chatroomId: number,
    friendNames: string,
    userId: number,
  ) {
    // 查询当前用户是否加入了该聊天室，否则没有权限拉人
    const isUserJoin = await this.isJoinChatRoom(chatroomId, userId);

    if (!isUserJoin) {
      throw new UnauthorizedException('您没有权限拉人');
    }

    // 判断该好友数据是否已经加入了该聊天室
    const friendInfo = await this.prismaService.user.findUnique({
      where: {
        username: friendNames,
      },
    });

    if (!friendInfo) {
      throw new UnauthorizedException('用户不存在');
    }

    const isFriendJoin = await this.isJoinChatRoom(chatroomId, friendInfo.id);

    if (isFriendJoin) {
      throw new UnauthorizedException('用户已经加入了该聊天室');
    }
    // 加入聊天室
    return await this.prismaService.userChatRoom.create({
      data: {
        userId: friendInfo.id,
        chatRoomId: chatroomId,
      },
      select: {
        userId: true,
        chatRoomId: true,
      },
    });
  }
}
