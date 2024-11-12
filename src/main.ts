import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerCustomOptions } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as expressBasicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

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
      .setTitle('NestJS project')
      .setDescription('NestJS project API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        // TODO : 인증 구현 후 true로 변경
        persistAuthorization: false,
      },
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, customOptions);
  }
  app.use(cookieParser(configService.get('auth.cookie.secret')));
  await app.listen(configService.get('app.port'));
  console.log(`STAGE: ${configService.get('app.nodeEnv')}`);
  console.log(`PORT: ${configService.get('app.port')}`);
}
bootstrap();
