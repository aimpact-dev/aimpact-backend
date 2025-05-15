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
exports.NonceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nonce_entity_1 = require("../../entities/nonce.entity");
const typeorm_2 = require("typeorm");
const generateMessage_1 = require("../utils/generateMessage");
let NonceService = class NonceService {
    constructor(nonceRepository) {
        this.nonceRepository = nonceRepository;
    }
    async addUsedNonce(address, nonce) {
        const userNonce = await this.nonceRepository.findOne({
            where: { nonce, address },
        });
        console.log(userNonce, userNonce?.dateOfUsage);
        if (!userNonce || userNonce?.dateOfUsage) {
            throw new Error(`The user with ${address} address already used nonce ${nonce}`);
        }
        let dateOfUsage = new Date();
        dateOfUsage = new Date(dateOfUsage.getTime() + dateOfUsage.getTimezoneOffset() * 60000);
        await this.nonceRepository.update(userNonce, {
            dateOfUsage,
        });
    }
    async isNonceUsed(address, nonce) {
        const nonceEntity = await this.nonceRepository
            .createQueryBuilder('nonce')
            .where('nonce.address = :address', { address })
            .andWhere('nonce.nonce = :nonce', { nonce })
            .andWhere('nonce.dateOfUsage IS NOT NULL')
            .getOne();
        console.log(nonceEntity, typeof nonceEntity, !!nonceEntity, "return false");
        return !!nonceEntity;
    }
    async createNewNonce(address) {
        const nonce = (0, generateMessage_1.generateNonce)();
        const nonceEntity = await this.nonceRepository.create({ address, nonce });
        await this.nonceRepository.save(nonceEntity);
        console.log(nonceEntity);
        return nonceEntity;
    }
};
exports.NonceService = NonceService;
exports.NonceService = NonceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nonce_entity_1.Nonce)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NonceService);
//# sourceMappingURL=nonce.service.js.map