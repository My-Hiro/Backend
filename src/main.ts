import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: INestApplication;

async function bootstrap(): Promise<INestApplication> {
  if (cachedApp) return cachedApp;

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('MyHiro API')
    .setDescription('The MyHiro API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  cachedApp = app;
  return app;
}

export const handler = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance() as express.Express;
  instance(req, res);
};

// Only listen when running locally
if (process.env.NODE_ENV !== 'production') {
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT || 4000;
      await app.listen(port);
      console.log(`Application is running on: http://localhost:${port}/api`);
      console.log(`Swagger documentation: http://localhost:${port}/docs`);
    })
    .catch((err) => {
      console.error('Error bootstrapping application', err);
    });
}
