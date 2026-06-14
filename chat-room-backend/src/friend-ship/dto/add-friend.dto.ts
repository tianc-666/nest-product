import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsNotEmpty({
    message: 'username is required',
  })
  username: string;

  @ApiProperty({ description: '添加理由', example: '你好，我想添加你为好友', required: false })
  reason: string;
}
