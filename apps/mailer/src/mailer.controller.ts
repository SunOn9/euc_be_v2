import { Controller } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @GrpcMethod('MailerSerive', 'SendMail')
  handleSendMail() {
    return '';
  }
}
