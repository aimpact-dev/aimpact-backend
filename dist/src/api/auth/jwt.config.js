"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const config_1 = require("@nestjs/config");
const config_2 = require("../../shared/config");
exports.jwtConfig = {
    imports: [config_1.ConfigModule.forFeature(config_2.jwtEnvConfig)],
    useFactory: async (jwtConfig) => ({
        secret: jwtConfig.JWT_SECRET,
        signOptions: { expiresIn: jwtConfig.JWT_EXPIRATION },
    }),
    inject: [config_2.jwtEnvConfig.KEY],
};
//# sourceMappingURL=jwt.config.js.map