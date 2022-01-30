const encodeBase64 = (str: string) => {
  return Buffer.from(str).toString('base64');
};

const decodeBase64 = (str: string) => {
  return Buffer.from(str, 'base64').toString();
};

export { encodeBase64, decodeBase64 };
