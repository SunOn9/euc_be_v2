import { Controller, HttpStatus } from '@nestjs/common'
import { MyMailerService } from './mailer.service'
import { GrpcMethod } from '@nestjs/microservices'
import { SendMailRequestDto } from './dto/send-mail-request.dto'
import { SendMailReply } from '@generated/mailer/mailer.reply'
import CustomException from 'apps/custom.exception'

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MyMailerService) {}

  @GrpcMethod('MailerService', 'SendMail')
  async handleSendMail(request: SendMailRequestDto): Promise<SendMailReply> {
    const response = SendMailReply.create()

    const data = await this.mailerService.test(request)

    // if (data.isErr()) {
    //   throw new CustomException(
    //     'ERROR',
    //     data.error.message,
    //     HttpStatus.BAD_REQUEST,
    //   )
    // }

    response.statusCode = 200
    response.message = ''
    response.payload = data.value
    return response
  }
}
