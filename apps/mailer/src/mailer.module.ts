import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        // await somePromise();
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        };
      },
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailModule {}
