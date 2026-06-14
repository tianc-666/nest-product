import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

// 全局模块，提供prisma客户端，npm install @prisma/client --save 然后服务端启用prisma.exe，根据配置的参数连接数据库
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
