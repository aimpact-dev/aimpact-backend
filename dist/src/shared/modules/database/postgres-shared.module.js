"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresSharedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const config_2 = require("../../config");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const postgres_config_factory_1 = require("./postgres-config.factory");
(0, typeorm_transactional_1.initializeTransactionalContext)();
console.log('Transactional context initialized');
let PostgresSharedModule = class PostgresSharedModule {
};
exports.PostgresSharedModule = PostgresSharedModule;
exports.PostgresSharedModule = PostgresSharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule.forFeature(config_2.databaseEnvConfig)],
                useClass: postgres_config_factory_1.PostgresConfigFactory,
                dataSourceFactory: async (options) => {
                    if (!options) {
                        throw Error('Datasource options missing');
                    }
                    return ((0, typeorm_transactional_1.getDataSourceByName)('main') ||
                        (0, typeorm_transactional_1.addTransactionalDataSource)({
                            name: 'main',
                            dataSource: new typeorm_2.DataSource(options),
                        }));
                },
            }),
        ],
    })
], PostgresSharedModule);
//# sourceMappingURL=postgres-shared.module.js.map