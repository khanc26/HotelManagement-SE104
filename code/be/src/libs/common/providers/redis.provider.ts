import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisProvider implements OnModuleInit, OnModuleDestroy {
  private static instance: Redis;
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>(
      'redis.url',
      'redis://localhost:6379',
    );

    const username = this.configService.get<string>('redis.username', '');
    const password = this.configService.get<string>('redis.password', '');

    this.redis = new Redis(
      redisUrl,
      username !== '' && password !== ''
        ? {
            username,
            password,
          }
        : {},
    );

    RedisProvider.instance = this.redis;

    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async set(key: string, value: any, ttl?: number) {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, data, 'PX', ttl);
    } else {
      await this.redis.set(key, data);
    }
  }

  async get(key: string) {
    const value = await this.redis.get(key);
    return value;
  }

  async delete(key: string) {
    await this.redis.del(key);
  }

  static getInstance(): Redis {
    if (!RedisProvider.instance)
      throw new Error('Redis client is not initialized yet.');
    return RedisProvider.instance;
  }
}
