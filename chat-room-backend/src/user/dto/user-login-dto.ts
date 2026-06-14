import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
