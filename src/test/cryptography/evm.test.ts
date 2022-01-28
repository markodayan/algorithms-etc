import { encodeFunctionSelector } from '@lib/cryptography/evm';

describe('#encodeFunctionSelector', () => {
  let functionSelector = 'withdraw(uint256)';

  it('Should encode the function selector supplied correctly to the EVM specification', () => {
    let encoded = encodeFunctionSelector(functionSelector);
    expect(encoded).toBe('0x2e1a7d4d');
  });
});
