import { Injectable } from '@nestjs/common'
import { RedisService } from 'libs/core/components/redis/redis.service'
import { SendMailRequestDto } from './dto/send-mail-request.dto'

@Injectable()
export class MailerService {
  constructor(private readonly redisService: RedisService) {}

  async test(request: SendMailRequestDto) {
    const res = await this.redisService.set('test', request.message)

    return res
  }
}
