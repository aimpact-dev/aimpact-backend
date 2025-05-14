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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const nonce_service_1 = require("../nonce/nonce.service");
const validSignMessage_1 = require("../utils/validSignMessage");
const generateMessage_1 = require("../utils/generateMessage");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, usersService, nonceService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.nonceService = nonceService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async loginWithSolanaWallet(address, signature, nonce) {
        let user = await this.usersService.findByWalletAddress(address);
        if (!user) {
            user = await this.usersService.createUserWithSolanaWallet(address, signature, nonce);
        }
        let isNonceUsed = await this.nonceService.isNonceUsed(user.id, nonce);
        if (isNonceUsed) {
            throw new common_1.HttpException(`User with wallet address ${address} have already used the nonce ${nonce}`, common_1.HttpStatus.UNAUTHORIZED);
        }
        const message = (0, generateMessage_1.generateMessage)(nonce);
        const isValid = (0, validSignMessage_1.validateSignedMessage)(address, message, signature);
        await this.nonceService.addUsedNonce(user.id, nonce);
        if (isValid) {
            const payload = { sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
        else {
            throw new common_1.HttpException(`The signed message isn't valid`, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async requestMessage(address) {
        const nonce = await this.nonceService.createNewNonce(address);
        const message = (0, generateMessage_1.generateMessage)(nonce.nonce);
        return { message, nonce: nonce.nonce };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        nonce_service_1.NonceService])
], AuthService);
//# sourceMappingURL=auth.service.js.map