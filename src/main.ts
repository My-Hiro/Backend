import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  // Create Express server
  const server = express();

  // Create Nest app
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('MyHiro API')
    .setDescription('The MyHiro API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 🚀 IMPORTANT: Render port binding
  const port = process.env.PORT || 4000;

  await app.listen(port, '0.0.0.0');

  console.log(`Server running on port ${port}`);
  console.log(`API: http://localhost:${port}/api`);
  console.log(`Docs: http://localhost:${port}/docs`);
}

bootstrap();
