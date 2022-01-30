const encodeBase64 = (str: string) => {
  return Buffer.from(str).toString('base64');
};

const decodeBase64 = (str: string) => {
  return Buffer.from(str, 'base64').toString();
};

/**
 * Decode hex into bytes, then encode it into Base64
 * @param {String} - str (hexadecimal string)
 * @returns {String} - base64-encoded string
 */
const encodeHexWithBase64 = (str: string): string => {
  const bytesArr = Uint8Array.from(Buffer.from(str, 'hex'));
  const buf: Buffer = Buffer.from(bytesArr);
  return buf.toString('base64');
};

export { encodeBase64, decodeBase64, encodeHexWithBase64 };
