import createKeccakHash from 'keccak';

const encodeFunctionSelector = (selector: string) => {
  let keccakHash = createKeccakHash('keccak256').update(selector).digest('hex');
  return keccakHash.substring(0, 8).padStart(10, '0x');
};

console.log(encodeFunctionSelector('withdraw(uint256)'));

export { encodeFunctionSelector };
