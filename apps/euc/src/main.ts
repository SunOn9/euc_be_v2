import { NestFactory } from '@nestjs/core';
import { EucModule } from './euc.module';

async function bootstrap() {
  const app = await NestFactory.create(EucModule);

  await app.listen(3000);
}
bootstrap();
