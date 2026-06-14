/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { UserCreateDto } from './dto/user-create-dto';
import { md5 } from 'src/utils';
import { UserLoginDto } from './dto/user-login-dto';
import { ModifyPasswordDto } from './dto/modify-password.dto';
import { ModifyUserInfoDto } from './dto/modify-userinfo.dto';
import { User } from 'generated/prisma/browser';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  private logger = new Logger();

  // 往user用户表中添加用户，要从redis中根据email校验是否有注册的验证码，有则校验通过，否则报错
  async create(data: UserCreateDto) {
    const captch = await this.redisService.get(`create_captch:${data.email}`);

    if (!captch) {
      throw new Error('captch not found');
    }

    if (captch !== data.captch) {
      throw new Error('captch not match');
    }

    const findUser = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (findUser) {
      throw new Error('username already exist');
    }

    delete data.captch;
    data.password = md5(data.password);
    try {
      return await this.prismaService.user.create({
        data,
        select: {
          id: true,
          username: true,
          email: true,
          headPic: true,
          createTime: true,
          updateTime: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error('create user failed');
    }
  }

  // 通过email module模块中暴露的sendEmail方法发送注册验证码
  async sendCreateCaptch(email: string) {
    const captch = Math.random().toString(36).substring(2, 6);
    await this.emailService.sendEmail({
      to: email,
      subject: '注册验证码',
      text: `您的注册验证码为 ${captch}，5分钟内有效`,
    });
    await this.redisService.set(`create_captch:${email}`, captch, 60 * 5);
  }

  // 登录，要从user用户表中根据username查询用户，然后校验密码是否匹配，匹配则返回用户信息，否则报错
  async login(data: UserLoginDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!findUser) {
      throw new BadRequestException('user not found');
    }

    if (findUser.password !== md5(data.password)) {
      throw new BadRequestException('password not match');
    }
    return findUser;
  }

  // 修改密码，要从redis中根据email校验是否有修改密码的验证码，有则校验通过，否则报错
  async modifyPassword(data: ModifyPasswordDto, userInfo: User) {
    const captch = await this.redisService.get(
      `modify_password_captch:${data.email}`,
    );

    if (!captch) {
      throw new BadRequestException('captch not found');
    }

    if (captch !== data.captch) {
      throw new BadRequestException('captch not match');
    }

    try {
      return await this.prismaService.user.update({
        where: {
          username: userInfo.username,
        },
        data: {
          password: md5(data.password),
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('modify password failed');
    }
  }

  // 获取用户信息，要从user用户表中根据username查询用户，返回用户信息
  async getUserInfo(userInfo: User) {
    return await this.prismaService.user.findUnique({
      where: {
        username: userInfo.username,
      },
    });
  }

  // 通过email module模块中暴露的sendEmail方法发送修改密码验证码
  async sendModifyPasswordCaptch(email: string) {
    const captch = Math.random().toString(36).substring(2, 6);
    await this.emailService.sendEmail({
      to: email,
      subject: '修改密码验证码',
      text: `您的修改密码验证码为 ${captch}，5分钟内有效`,
    });
    await this.redisService.set(
      `modify_password_captch:${email}`,
      captch,
      60 * 5,
    );
  }

  // 修改用户信息，要从user用户表中根据username查询用户，然后更新用户信息，返回用户信息
  async modifyUserInfo(data: ModifyUserInfoDto, userInfo: User) {
    try {
      return await this.prismaService.user.update({
        where: {
          username: userInfo.username,
        },
        data: {
          ...data,
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('modify user info failed');
    }
  }
  // 根据id从user表中查询
  async findUserInfoById(id: number) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
