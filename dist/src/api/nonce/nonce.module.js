"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonceModule = void 0;
const common_1 = require("@nestjs/common");
const nonce_service_1 = require("./nonce.service");
const nonce_controller_1 = require("./nonce.controller");
const nonce_entity_1 = require("../../entities/nonce.entity");
const typeorm_1 = require("@nestjs/typeorm");
let NonceModule = class NonceModule {
};
exports.NonceModule = NonceModule;
exports.NonceModule = NonceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([nonce_entity_1.Nonce])],
        providers: [nonce_service_1.NonceService],
        controllers: [nonce_controller_1.NonceController],
        exports: [nonce_service_1.NonceService],
    })
], NonceModule);
//# sourceMappingURL=nonce.module.js.map