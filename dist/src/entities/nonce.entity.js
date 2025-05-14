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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nonce = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Nonce = class Nonce {
};
exports.Nonce = Nonce;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the tournament.',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Nonce.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the nonce was used',
        example: '2024-01-20T18:00:00Z',
    }),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Nonce.prototype, "dateOfUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The nonce which was used by the owner',
        example: 16,
    }),
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Nonce.prototype, "nonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address of the user',
        example: '7HmYsWHYZzixB3px79Y9sx91puwvLtv4ikLB9evx1vX4',
    }),
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Nonce.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the nonce was created',
        example: '2024-01-20T18:00:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Nonce.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the nonce was updated',
        example: '2024-01-20T18:00:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Nonce.prototype, "updatedAt", void 0);
exports.Nonce = Nonce = __decorate([
    (0, typeorm_1.Entity)('nonce')
], Nonce);
//# sourceMappingURL=nonce.entity.js.map