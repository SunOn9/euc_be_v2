import { Injectable } from '@nestjs/common'
import { RedisService } from 'libs/core/components/redis/redis.service'
import { SendMailRequestDto } from './dto/send-mail-request.dto'
import { MailerService } from '@nestjs-modules/mailer'
import { ok } from 'neverthrow'

@Injectable()
export class MyMailerService {
  constructor(
    // private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async test(request: SendMailRequestDto) {
    const res = await this.mailerService.sendMail({
      to: 'lehophattai@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './test',
      context: {
        name: request.message,
        url: '',
      },
    })

    return ok('ok')
  }
}
