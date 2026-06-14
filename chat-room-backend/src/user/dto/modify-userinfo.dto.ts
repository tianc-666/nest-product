import { ApiProperty } from '@nestjs/swagger';

export class ModifyUserInfoDto {
  @ApiProperty({ description: '邮箱', example: 'test@example.com', required: false })
  email: string;

  @ApiProperty({ description: '头像', example: 'https://example.com/avatar.jpg', required: false })
  headPic: string;

  @ApiProperty({ description: '昵称', example: '新昵称', required: false })
  nickName: string;
}
