import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerCustomOptions } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as expressBasicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('app.corsWhitelist').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const SWAGGER_ENVS = ['local', 'development'];
  const stage = configService.get('app.nodeEnv');
  if (SWAGGER_ENVS.includes(stage)) {
    app.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [configService.get('swagger.user')]:
            configService.get('swagger.password'),
        },
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('CSHub API')
      .setDescription('CSHub API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, customOptions);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(configService.get('app.port'));
  console.log(`STAGE: ${configService.get('app.nodeEnv')}`);
  console.log(`PORT: ${configService.get('app.port')}`);
}
bootstrap();
