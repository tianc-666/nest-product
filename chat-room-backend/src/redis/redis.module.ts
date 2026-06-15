import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

// npm install redis --save 然后服务端启用redis.exe，根据配置的参数连接redis服务
@Global()
@Module({
  imports: [],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: process.env.REDIS_HOST || 'redis',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
