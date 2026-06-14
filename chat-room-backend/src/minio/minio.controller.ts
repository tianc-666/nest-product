import { Controller, Get, Inject, Query } from '@nestjs/common';
import * as Minio from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;
  @Get('presignedUrl')
  presignedPutObject(@Query('fileName') fileName: string) {
    return this.minioClient.presignedPutObject('chat-room', fileName);
  }
}
