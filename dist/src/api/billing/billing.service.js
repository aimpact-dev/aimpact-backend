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
const user_entity_1 = require("../../entities/user.entity");
const typeorm_2 = require("typeorm");
let BillingService = BillingService_1 = class BillingService {
    constructor(configService, receiptRepository, userRepository) {
        this.configService = configService;
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
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
        this.lastLamports = await this.connection.getBalance(account, 'confirmed');
        const subscriptionId = await this.connection.onAccountChange(account, async (accountInfo, context) => {
            const currentLamports = accountInfo.lamports;
            const diff = currentLamports - this.lastLamports;
            if (diff > 0) {
                const solAmount = diff / 1e9;
                const signatures = await this.connection.getSignaturesForAddress(account, {
                    limit: 5,
                });
                for (const sigInfo of signatures) {
                    try {
                        const tx = await this.connection.getParsedTransaction(sigInfo.signature, {
                            commitment: 'confirmed',
                            maxSupportedTransactionVersion: 1,
                        });
                        if (!tx || !tx.meta || tx.meta.err)
                            continue;
                        const transferIx = tx.transaction.message.instructions.find((ix) => 'parsed' in ix &&
                            ix.program === 'system' &&
                            ix.parsed.type === 'transfer' &&
                            ix.parsed.info.destination === walletToTrack);
                        if (!transferIx)
                            continue;
                        const sender = transferIx.parsed.info.source;
                        const amount = transferIx.parsed.info.lamports / 1e9;
                        if (Math.abs(amount - solAmount) > 0.000001)
                            continue;
                        const timestamp = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
                        await this.processFundReceipt(sigInfo.signature, sender, amount, timestamp);
                    }
                    catch (error) {
                        this.logger.error('getParsedTransaction error:', error);
                        break;
                    }
                    await sleep(100);
                }
            }
        }, 'confirmed');
    }
    async processFundReceipt(txHash, sender, amount, timestamp) {
        const tx = await this.findByTransactionHash(txHash);
        if (tx) {
            this.logger.log(`transaction with signature ${txHash} already exist`);
            return;
        }
        const user = await this.userRepository.findOne({ where: { wallet: sender } });
        let userId;
        if (!user) {
            const newUser = this.userRepository.create({
                wallet: sender,
                updatedAt: new Date(),
                createdAt: new Date(),
            });
            const savedUser = await this.userRepository.save(newUser);
            userId = savedUser.id;
        }
        else {
            userId = user.id;
        }
        const receipt = this.receiptRepository.create({
            userId,
            amount,
            timestamp: new Date(),
            transactionHash: txHash,
        });
        await this.receiptRepository.save(receipt);
        this.logger.log(`transaction ${txHash} processed: from ${sender} SOL ${amount}`);
    }
    async findByTransactionHash(transactionHash) {
        return this.receiptRepository.findOne({
            where: { transactionHash },
        });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(funds_receipt_entity_1.FundsReceipt)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
function isParsedInstruction(ix) {
    return 'parsed' in ix;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=billing.service.js.map