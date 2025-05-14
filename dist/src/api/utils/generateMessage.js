"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNonce = exports.generateMessage = void 0;
const generateMessage = (nonce) => {
    return `SignIn\n${nonce}`;
};
exports.generateMessage = generateMessage;
const generateNonce = () => {
    return crypto.randomUUID();
};
exports.generateNonce = generateNonce;
//# sourceMappingURL=generateMessage.js.map