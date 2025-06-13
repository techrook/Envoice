"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const logger_config_1 = require("./common/log/logger.config");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const openapi_1 = require("./common/interfaces/openapi");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(logger_config_1.default));
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const logger = app.get(logger_config_1.default);
    const port = configService.get('port');
    const appName = configService.get('appName');
    const appVersion = configService.get('version');
    const appHost = configService.get('host');
    const initSwagger = (app, serverUrl) => {
        const config = new swagger_1.DocumentBuilder()
            .setTitle(appName)
            .setDescription(appName)
            .setVersion(appVersion)
            .addServer(serverUrl, 'Development Server')
            .addBearerAuth();
        for (const ApiTagName in openapi_1.AppApiTags) {
            config.addTag(ApiTagName, openapi_1.AppApiTags[ApiTagName].description);
        }
        const document = swagger_1.SwaggerModule.createDocument(app, config.build());
        swagger_1.SwaggerModule.setup('/api-docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    };
    logger.log(`Starting [${configService.get('appName')}] on port=[${port}]`);
    initSwagger(app, appHost);
    app.enableCors();
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map