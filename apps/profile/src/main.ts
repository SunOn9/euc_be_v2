import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomRpcExceptionFilter } from 'apps/exception.filter';

async function bootstrap() {
  const profileApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProfileModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env['GRPC_URL_PROFILE'],
        package: ['profile'],
        loader: {
          longs: String,
          enums: String,
          json: true,
          defaults: true,
        },
        protoPath: [join(__dirname, '../../protos/profile/api.proto')],
      },
    },
  );

  profileApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  profileApp.useGlobalFilters(new CustomRpcExceptionFilter());

  await profileApp.listen();

  console.debug(
    `GRPC PROFILE is running on: ${process.env['GRPC_URL_PROFILE']}`,
  );
}

bootstrap();
