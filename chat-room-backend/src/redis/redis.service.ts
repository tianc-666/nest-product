import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';

// redis的方法
@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private client: RedisClientType;

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.client.set(key, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async keys(pattern: string) {
    return await this.client.keys(pattern);
  }
}
