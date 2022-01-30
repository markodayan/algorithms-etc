import { encodeBase64, decodeBase64 } from '@lib/cryptography/base64';

describe('#encodeFunctionSelector', () => {
  it('Should encode a string via Base64 encoding scheme', () => {
    const encoded = encodeBase64('Hello World!');
    expect(encoded).toBe('SGVsbG8gV29ybGQh');
  });

  it('Should decode a Base64-encoded string', () => {
    const decoded = decodeBase64('SGVsbG8gV29ybGQh');
    expect(decoded).toBe('Hello World!');
  });
});
