import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { UserService } from 'src/user/user.service';

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface sendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image' | 'file';
    content: string;
  };
}

// websocket也需要配置跨域
@WebSocketGateway({ cors: { orign: '*' } })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @Inject(UserService)
  private userService: UserService;
  @WebSocketServer()
  server: Server;

  // 定义加入房间的事件
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload) {
    const roomName = payload.chatroomId.toString();
    // 链接到房间
    client.join(roomName);
    // 给房间内的所有用户发送加入房间的消息
    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId,
    });
  }

  // 定义发送消息的事件
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: sendMessagePayload) {
    const roomName = payload.chatroomId.toString();
    // 调用chat-history服务新增一条聊天记录
    await this.chatHistoryService.addChatHistory({
      chatroomId: payload.chatroomId,
      type:
        payload.message.type === 'image'
          ? 1
          : payload.message.type === 'file'
            ? 2
            : 0,
      content: payload.message.content,
      senderId: payload.sendUserId,
    });

    const user = await this.userService.findUserInfoById(payload.sendUserId);
    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      senderId: payload.sendUserId,
      content: payload.message.content,
      sendUserInfo: user,
      messageType: payload.message.type,
    });
  }
}
