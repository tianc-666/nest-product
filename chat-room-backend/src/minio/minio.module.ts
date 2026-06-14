import { Global, Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import * as Minio from 'minio';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory() {
        const client = new Minio.Client({
          endPoint: process.env.MINIO_ENDPOINT || 'minio',
          port: parseInt(process.env.MINIO_PORT || '9000'),
          useSSL: false,
          accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
          secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        });
        return client;
      },
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController],
})
export class MinioModule {}
