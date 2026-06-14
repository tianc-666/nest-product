import { Global, Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import * as Minio from 'minio';

// 全局模块，提供minio客户端，npm install minio --save 然后服务端启用minio.exe，根据配置的参数连接minio服务
@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory() {
        const client = new Minio.Client({
          endPoint: '192.168.1.22',
          port: 9000,
          useSSL: false,
          accessKey: 'xuxy8FsY1n3G1mdqUGUw',
          secretKey: '46vmBjM1fN1bEBlElVzOaBTzWm9AHJvm7J8wT4Xg',
        });
        return client;
      },
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController],
})
export class MinioModule {}
