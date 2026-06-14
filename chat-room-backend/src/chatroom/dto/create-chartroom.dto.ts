import { IsNotEmpty } from 'class-validator';

export class CreateChatRoomDto {
  name: string;

  @IsNotEmpty({
    message: '聊天室类型不能为空',
  })
  type: number;

  friendId: number;
}
