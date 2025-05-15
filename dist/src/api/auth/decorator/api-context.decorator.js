"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiContext = void 0;
const common_1 = require("@nestjs/common");
exports.ApiContext = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        throw new common_1.UnauthorizedException('No profile found');
    }
    return request.user;
});
//# sourceMappingURL=api-context.decorator.js.map