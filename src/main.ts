import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { envLoad } from './shared/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './api/auth/jwt-auth.guard';

async function bootstrap() {
  await envLoad();

  const app = await NestFactory.create(AppModule);
  if (process.env.ENABLE_CORS) app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('AImpact API docs')
    .setDescription('The AImpact API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  // adding global jwt auth guard
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
