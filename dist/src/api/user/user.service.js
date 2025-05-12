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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
const typeorm_2 = require("typeorm");
const validSignMessage_1 = require("../utils/validSignMessage");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findByWalletAddress(wallet) {
        return await this.userRepository.findOne({ where: { wallet } });
    }
    async findById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async createUserWithSolanaWallet(wallet, signedMessage) {
        const message = `I agree that I am registered in aimpact as user and allow to store my ${wallet} wallet address`;
        const isValid = (0, validSignMessage_1.validateSignedMessage)(wallet, message, signedMessage);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        const existingUser = await this.userRepository.findOne({
            where: { wallet },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('User with such wallet address already exist');
        }
        const newUser = this.userRepository.create({
            wallet,
        });
        const user = await this.userRepository.save(newUser);
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map