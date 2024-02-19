import { NestFactory } from '@nestjs/core'
import { MailModule } from './mailer.module'
import { join } from 'path'
import { ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { CustomRpcExceptionFilter } from 'apps/exception.filter'

async function bootstrap() {
  const mailerApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env['GRPC_URL_MAILER'],
        package: ['mailer'],
        loader: {
          longs: String,
          enums: String,
          json: true,
          defaults: true,
        },
        protoPath: [join(__dirname, '../../../protos/mailer/api.proto')],
      },
      logger: ['error', 'warn', 'debug', 'verbose'],
    },
  )

  mailerApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  )

  mailerApp.useGlobalFilters(new CustomRpcExceptionFilter())

  await mailerApp.listen()

  console.debug(`GRPC MAILER is running on: ${process.env['GRPC_URL_MAILER']}`)
}

bootstrap()
