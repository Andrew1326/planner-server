import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const { CLIENT_ORIGIN } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply validation
  app.useGlobalPipes(new ValidationPipe());

  // define cors setting
  app.enableCors({
    origin: CLIENT_ORIGIN,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
