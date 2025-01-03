import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import AppLogger from './common/log/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppApiTags } from './common/interfaces/openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(AppLogger));

  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const logger = app.get(AppLogger);
  const port = configService.get('port');
  const appName = configService.get('appName');
  const appVersion = configService.get('version');
  const appHost = configService.get('host');

  const initSwagger = (app: INestApplication, serverUrl: string) => {
    const config = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(appName)
      .setVersion(appVersion)
      .addServer(serverUrl, 'Development Server')

      .addBearerAuth();

    for (const ApiTagName in AppApiTags) {
      config.addTag(ApiTagName, AppApiTags[ApiTagName].description);
    }
    const document = SwaggerModule.createDocument(app, config.build());

    SwaggerModule.setup('/api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  };

  logger.log(`Starting [${configService.get('appName')}] on port=[${port}]`);
  initSwagger(app, appHost);
  await app.listen(port);
}
bootstrap();
