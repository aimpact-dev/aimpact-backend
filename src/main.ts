import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { envLoad } from './shared/config';

async function bootstrap() {
  await envLoad();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
