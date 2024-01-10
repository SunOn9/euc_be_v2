import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

dotenv.config();
const cwd = process.cwd();
// const synchronizeDatabaseStructure = process.env.APP_ENV == 'dev';

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
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        ttl: configService.get('REDIS_CACHE_TTL'),
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        isGlobal: true,
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
