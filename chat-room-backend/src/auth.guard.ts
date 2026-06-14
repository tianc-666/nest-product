/* eslint-disable */

import { CanActivate, Inject, UnauthorizedException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

interface JwtUserData {
  userId: number;
  username: string;
}

export class AuthGuard implements CanActivate {
  // 引入reflector，用于获取装饰器上的元数据
  @Inject()
  private reflector: Reflector;
  // 引入jwtService，用于验证token，在app.module引入
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 从context获取request和response
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtUserData }>();
    const response = context.switchToHttp().getResponse<Response>();

    // 获取登录标识
    const requiredLogin = this.reflector.getAllAndOverride<boolean>(
      'requiedLogin',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredLogin) {
      return true;
    }
    // 从请求头上获取token
    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('未登录，请先登录');
    }
    try {
      // 获取真实的token ，格式为：Bearer token
      const token = authorization.split(' ')[1];
      // 校验token，取出token中的userId和username
      const data = this.jwtService.verify(token);
      // 放到request.user 中，后续可以从request.user中获取userId和username
      request.user = {
        userId: data.userId,
        username: data.username,
      };

      // 每次请求需要登录的接口都延长token
      response.header(
        'Authorization',
        this.jwtService.sign(
          {
            userId: data.userId,
            username: data.username,
          },
          {
            expiresIn: '7h',
          },
        ),
      );
      return true;
    } catch (error) {
      throw new UnauthorizedException('token 验证失败，请重新登录');
    }
  }
}
