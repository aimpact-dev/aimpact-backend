import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { envLoad } from './shared/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './api/auth/jwt-auth.guard';
import { json, urlencoded } from 'express';

async function bootstrap() {
  await envLoad();

  const app = await NestFactory.create(AppModule);

  // Increase body size limit
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('AImpact API docs')
    .setDescription('The AImpact API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // adding global jwt auth guard
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
