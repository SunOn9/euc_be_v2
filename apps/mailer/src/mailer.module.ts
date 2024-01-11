import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

dotenv.config();
const cwd = process.cwd();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(cwd, 'uploads'),
      renderPath: '/uploads/*',
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(cwd, 'data'),
      renderPath: '/data/*',
      serveRoot: '/data',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'localhost',
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('EMAIL_APP_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <euc@noreply.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailModule {}
