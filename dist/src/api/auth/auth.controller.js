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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const signinWallet_dto_1 = require("../dtos/signinWallet.dto");
const public_decorator_1 = require("./decorator/public.decorator");
const requestMessage_dto_1 = require("../dtos/requestMessage.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async loginWithWallet(signin) {
        return this.authService.loginWithSolanaWallet(signin.walletAddress, signin.signedMessage, signin.nonce);
    }
    async requestMessage(signin) {
        return this.authService.requestMessage(signin.walletAddress);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('loginWithWallet'),
    (0, swagger_1.ApiOperation)({
        summary: 'User login by sign message with his Solana wallet',
        description: 'User need to sign message "Sign this message to prove you have access to this wallet with nonce <uniq nonce, for example you can use current timestamp>."',
    }),
    (0, swagger_1.ApiBody)({
        type: signinWallet_dto_1.SigninWalletDto,
        description: 'User login credentials by using wallet.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful authentication.',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signinWallet_dto_1.SigninWalletDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithWallet", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('requestMessage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request message and nonce from backend',
        description: 'User need to sign message "Sign this message to prove you have access to this wallet with nonce <uniq nonce, for example you can use current timestamp>."',
    }),
    (0, swagger_1.ApiBody)({
        type: requestMessage_dto_1.RequestMessageDto,
        description: 'User login credentials by using wallet.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful authentication.',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requestMessage_dto_1.RequestMessageDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestMessage", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map