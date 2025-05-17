"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FinalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let FinalExceptionFilter = FinalExceptionFilter_1 = class FinalExceptionFilter {
    static parseError(exception) {
        return exception instanceof common_1.HttpException ? exception : new common_1.InternalServerErrorException(exception.message);
    }
    catch(originException, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const httpException = FinalExceptionFilter_1.parseError(originException);
        common_1.Logger.error(originException.stack);
        return response.status(httpException.getStatus()).json(httpException.getResponse());
    }
};
FinalExceptionFilter = FinalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], FinalExceptionFilter);
exports.default = FinalExceptionFilter;
//# sourceMappingURL=final-exception.filter.js.map