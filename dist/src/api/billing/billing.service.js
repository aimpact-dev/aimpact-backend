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
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const web3_js_1 = require("@solana/web3.js");
const funds_receipt_entity_1 = require("../../entities/funds-receipt.entity");
const typeorm_2 = require("typeorm");
let BillingService = BillingService_1 = class BillingService {
    constructor(configService, receiptRepository) {
        this.configService = configService;
        this.receiptRepository = receiptRepository;
        this.logger = new common_1.Logger(BillingService_1.name);
        const wss_rpc = configService.get('WSS_RPC_URL');
        const http_rpc = configService.get('HTTP_RPC_URL');
        if (!wss_rpc)
            throw new Error('WSS_RPC_URL not set up');
        if (!http_rpc)
            throw new Error('HTTP_RPC_URL not set up');
        this.connection = new web3_js_1.Connection(http_rpc, { wsEndpoint: wss_rpc });
    }
    async onModuleInit() {
        const walletToTrack = this.configService.get('TRACK_WALLET');
        if (!walletToTrack)
            throw new Error('TRACK_WALLET not set up');
        const account = new web3_js_1.PublicKey(walletToTrack);
        const subscriptionId = await this.connection.onAccountChange(account, (updatedAccountInfo) => {
            console.log(`---Event Notification for ${walletToTrack}--- \nNew Account Balance:`);
            console.log('data:', JSON.stringify(updatedAccountInfo, null, 2));
        }, 'confirmed');
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(funds_receipt_entity_1.FundsReceipt)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map