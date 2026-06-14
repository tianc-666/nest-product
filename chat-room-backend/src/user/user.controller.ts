/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { UserCreateDto } from './dto/user-create-dto';
import { UserLoginDto } from './dto/user-login-dto';
import { JwtService } from '@nestjs/jwt';
import { RequiedLogin, UserInfo } from 'src/custom.decorator';
import { ModifyPasswordDto } from './dto/modify-password.dto';
import { User } from 'generated/prisma/browser';
import { ModifyUserInfoDto } from './dto/modify-userinfo.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async register(@Body() data: UserCreateDto) {
    return await this.userService.create(data);
  }

  @Get('create-captcha')
  @ApiOperation({ summary: '发送注册验证码' })
  @ApiQuery({ name: 'email', description: '邮箱地址', required: true })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  async sendCreateCaptch(@Query('email') email: string) {
    return await this.userService.sendCreateCaptch(email);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() data: UserLoginDto) {
    const user = await this.userService.login(data);

    return {
      user,
      token: this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        { expiresIn: '7d' },
      ),
    };
  }

  @RequiedLogin()
  @Post('modify-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 200, description: '密码修改成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async modifyPassword(
    @Body() data: ModifyPasswordDto,
    @UserInfo() userInfo: User,
  ) {
    await this.userService.modifyPassword(data, userInfo);
    return {
      message: 'modify password success',
    };
  }

  @RequiedLogin()
  @Get('modify-password-captch')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '发送修改密码验证码' })
  @ApiQuery({ name: 'email', description: '邮箱地址', required: true })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async sendModifyPasswordCaptch(@Query('email') email: string) {
    return await this.userService.sendModifyPasswordCaptch(email);
  }

  @RequiedLogin()
  @Get('info')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getUserInfo(@UserInfo() userInfo: User) {
    return await this.userService.getUserInfo(userInfo);
  }

  @RequiedLogin()
  @Post('modify-userinfo')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '修改用户信息' })
  @ApiResponse({ status: 200, description: '修改成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async modifyUserInfo(
    @Body() data: ModifyUserInfoDto,
    @UserInfo() userInfo: User,
  ) {
    return await this.userService.modifyUserInfo(data, userInfo);
  }
}
