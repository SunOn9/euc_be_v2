import { SendMailRequest } from '@generated/mailer/mailer.request'
import { IsNotEmpty } from 'class-validator'

export class SendMailRequestDto implements SendMailRequest {
  @IsNotEmpty()
  message: string

  constructor(partial: Partial<SendMailRequestDto>) {
    Object.assign(this, partial)
  }
}
