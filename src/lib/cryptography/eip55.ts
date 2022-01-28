import createKeccakHash from 'keccak';

const hexGreaterThan = (limit: string) => (val: string) => parseInt(val, 16) >= parseInt(limit, 16);
const hexGreaterThan8 = hexGreaterThan('8');
const toCapitalise = (hex: string) => hexGreaterThan8(hex);

const eip55Checksum = (address: string) => {
  let formatted = address.startsWith('0x') ? address.substring(2) : address;
  let keccakHash = createKeccakHash('keccak256').update(formatted).digest('hex');
  return (
    '0x' +
    formatted
      .split('')
      .map((v, i, arr) => (toCapitalise(keccakHash[i]) ? v.toUpperCase() : v))
      .join('')
  );
};

export { eip55Checksum };
