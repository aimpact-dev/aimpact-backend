export const generateMessage = (nonce: string) => {
  return `SignIn\n${nonce}`;
};

export const generateNonce = () => {
  return crypto.randomUUID();
};
