import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyPasswordDto {
  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ description: '新密码', example: 'newpassword123', minLength: 6, maxLength: 20 })
  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @MaxLength(20, { message: 'password must be at most 20 characters' })
  password: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsNotEmpty({
    message: 'captch is required',
  })
  captch: string;
}
