import { eip55Checksum } from '@lib/cryptography/eip55';

describe('#caeserCipher', () => {
  const address = '0x001d3f1ef827552ae1114027bd3ecf1f086ba0f9';
  const nonPrefixedAddress = '001d3f1ef827552ae1114027bd3ecf1f086ba0f9';

  it('Should return the correct EIP-55 checksum of the Ethereum address (given the address supplied was in conventional address form (prefixed by 0x)', () => {
    const checksumAddr = eip55Checksum(address);
    expect(checksumAddr).toBe('0x001d3F1ef827552Ae1114027BD3ECF1f086bA0F9');
  });

  it('Should return the correct EIP-55 checksum of the Ethereum address (non-prefixed address supplied)', () => {
    const checksumAddr = eip55Checksum(nonPrefixedAddress);
    expect(checksumAddr).toBe('0x001d3F1ef827552Ae1114027BD3ECF1f086bA0F9');
  });
});
