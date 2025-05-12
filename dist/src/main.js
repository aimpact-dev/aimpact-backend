"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./api/app.module");
const config_1 = require("./shared/config");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./api/auth/jwt-auth.guard");
async function bootstrap() {
    await (0, config_1.envLoad)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AImpact API docs')
        .setDescription('The AImpact API description')
        .setVersion('1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, documentFactory);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(new core_1.Reflector()));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map