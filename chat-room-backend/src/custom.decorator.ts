/* eslint-disable */
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';

export const RequiedLogin = () => SetMetadata('requiedLogin', true);
// 创建装饰器，用于获取用户信息，auth.guard.ts中 定义user信息到req上
export const UserInfo = createParamDecorator(
  (data: string, content: ExecutionContext) => {
    const req = content.switchToHttp().getRequest<Request & { user: any }>();
    if (!req.user) {
      throw new UnauthorizedException('user not found');
    }

    return data ? req.user[data] : req.user;
  },
);
