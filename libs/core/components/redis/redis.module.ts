import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { RedisService } from './redis.service'
import { Global } from '@nestjs/common'

@Global()
@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class MyRedisModule {}
