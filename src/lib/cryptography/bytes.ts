import { asciiReduce } from '@src/lib/utils/ascii';

const stringToAsciiBytes = (str: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(str));
};

const stringToHexBytes = (str: string): string[] => {
  let arr = Array.from(Buffer.from(str));
  return arr.map((v) => v.toString(16));
};

const stringToHexEncoded = (str: string): string => {
  return stringToHexBytes(str).reduce((acc, v) => acc + v, '0x');
};

const stringToIntegerEncoded = (str: string): number => {
  const hex = stringToHexEncoded(str);
  return parseInt(hex);
};

const decodeIntegerMessage = (code: string): string => {
  const num = BigInt(code);
  const base16 = num.toString(16);
  const hexBuffer = Buffer.from(base16, 'hex'); // converting hex encoded message to hex Buffer
  const bytesArr = Uint8Array.from(hexBuffer); // convert hex buffer to byte array
  return asciiReduce(Array.from(bytesArr));
};

export { stringToAsciiBytes, stringToHexBytes, stringToHexEncoded, stringToIntegerEncoded, decodeIntegerMessage };
