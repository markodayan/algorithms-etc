import { encodeBase64, decodeBase64, encodeHexWithBase64 } from '@lib/cryptography/base64';

describe('#encodeFunctionSelector', () => {
  it('Should encode a string via Base64 encoding scheme', () => {
    const encoded = encodeBase64('Hello World!');
    expect(encoded).toBe('SGVsbG8gV29ybGQh');
  });

  it('Should decode a Base64-encoded string', () => {
    const decoded = decodeBase64('SGVsbG8gV29ybGQh');
    expect(decoded).toBe('Hello World!');
  });

  it('Should take a hex string input, decode it into bytes and finally encode it into Base64', () => {
    const hexStr = '72bca9b68fc16ac7beeb8f849dca1d8a783e8acf9679bf9269f7bf';
    const encoded = encodeHexWithBase64(hexStr);
    expect(encoded).toBe('crypto/Base+64+Encoding+is+Web+Safe/');
  });
});
