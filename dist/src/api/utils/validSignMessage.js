"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignedMessage = validateSignedMessage;
const nacl = require("tweetnacl");
const bs58 = require("bs58");
function validateSignedMessage(walletAddress, message, signedMessage) {
    const messageUint8 = new TextEncoder().encode(message);
    const signatureUint8 = bs58.default.decode(signedMessage);
    const publicKeyUint8 = bs58.default.decode(walletAddress);
    return nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);
}
//# sourceMappingURL=validSignMessage.js.map