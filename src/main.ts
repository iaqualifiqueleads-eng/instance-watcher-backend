import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'https://instance-watcher.vercel.app'
    ],
    allowedHeaders: ['Content-Type', 'Origin', 'Authorization', 'Referer', 'Access-Control-Allow-Origin'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: false,
  });

  app.enableCors({
    origin: true,
  })

  const config = new DocumentBuilder()
    .setTitle('API Instances Watcher')
    .setDescription('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'Header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // mantém token após recarregar
    }
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(process.env.PORT || 3000);
  const logger = new Logger();

  logger.verbose(`Base Url: http://localhost:3000 🌐`);
  logger.verbose(`Swagger: http://localhost:3000/api 📜`);

  logger.verbose(`Service is active 😎 ╭∩╮( ＾◡＾)╭∩╮`);

}
bootstrap();
