"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresConfigFactory = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../config");
let PostgresConfigFactory = class PostgresConfigFactory {
    constructor(baseConfig, databaseConfig) {
        this.baseConfig = baseConfig;
        this.databaseConfig = databaseConfig;
    }
    createTypeOrmOptions() {
        return {
            type: 'postgres',
            host: this.databaseConfig.DATABASE_HOST || 'localhost',
            port: this.databaseConfig.DATABASE_PORT || 5432,
            username: this.databaseConfig.DATABASE_USER,
            password: this.databaseConfig.DATABASE_PASSWORD,
            database: this.databaseConfig.DATABASE_NAME,
            entities: [`${__dirname}/../entities/*.entity{.ts,.js}`],
            synchronize: this.baseConfig.NODE_ENV === 'development',
            logging: this.baseConfig.NODE_ENV === 'development',
            migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
            migrationsTableName: 'migrations',
        };
    }
};
exports.PostgresConfigFactory = PostgresConfigFactory;
exports.PostgresConfigFactory = PostgresConfigFactory = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_1.baseEnvConfig.KEY)),
    __param(1, (0, common_1.Inject)(config_1.databaseEnvConfig.KEY)),
    __metadata("design:paramtypes", [void 0, void 0])
], PostgresConfigFactory);
//# sourceMappingURL=postgres-config.factory.js.map