import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import * as Minio from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;

  @Get('presignedUrl')
  async presignedPutObject(@Query('fileName') fileName: string, @Req() req: Request) {
    const url = await this.minioClient.presignedPutObject('chat-room', fileName);
    // 用请求的 host 替换 Docker 内部地址
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return url.replace(/http:\/\/minio:9000/, `${protocol}://${host}`);
  }
}
