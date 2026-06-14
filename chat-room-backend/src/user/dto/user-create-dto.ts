import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsNotEmpty({
    message: 'username is required',
  })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({
    message: 'password is required',
  })
  password: string;

  @ApiProperty({ description: '昵称', example: '测试用户' })
  @IsNotEmpty({
    message: 'nickName is required',
  })
  nickName: string;

  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail(
    {},
    {
      message: 'email is not valid',
    },
  )
  email: string;

  @ApiProperty({ description: '头像', required: false })
  headPic?: string;

  @ApiProperty({ description: '创建时间', required: false })
  createTime?: Date | string;

  @ApiProperty({ description: '更新时间', required: false })
  updateTime?: Date | string;

  @ApiProperty({ description: '验证码', required: false })
  captch?: string;
}
