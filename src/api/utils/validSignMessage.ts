import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
export function validateSignedMessage(walletAddress: string, message: string, signedMessage: string): boolean {
  const messageUint8 = new TextEncoder().encode(message);
  const signatureUint8 = bs58.default.decode(signedMessage);
  const publicKeyUint8 = bs58.default.decode(walletAddress);
  return nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);
}
