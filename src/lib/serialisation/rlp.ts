import RLP from 'rlp';

type Input = string | number | bigint | Uint8Array | Array<Input> | null | undefined;

function removePrefix(input: string): string {
  if (input.startsWith('0x')) {
    input = input.slice(2);
  }

  return input;
}

function isEscapedFormat(input: Input): boolean {
  if (typeof input === 'string') {
    return encodeURI(input[0]).startsWith('%');
  }

  return false;
}

function getByteSize(input: string | Array<Input>): number {
  return input.length;
}

function encode(input: Input): Uint8Array {
  // Base Cases
  if (input === '') return Uint8Array.from([parseInt('0x80', 16)]);
  if (input === null) return Uint8Array.from([parseInt('0x80', 16)]);
  if (input === []) return Uint8Array.from([parseInt('0xc0', 16)]);
  if (input === 0) return Uint8Array.from([parseInt('0x80', 16)]);

  if (isEscapedFormat(input)) {
    // @ts-ignore
    const payload: any[] = (input as string)
      .split('')
      .reduce((acc, v) => acc + encodeURI(v).slice(1), '')
      .match(/.{1,2}/g);

    // if escaped hex is one byte
    if (payload.length === 1) {
      return Uint8Array.from([parseInt(payload[0], 16)]);
    }

    if (payload!.length <= 55) {
      const first = parseInt('0x80', 16) + payload!.length;
      return Uint8Array.from([first, ...payload]);
    }
  } else if (typeof input === 'string' && input.startsWith('0x')) {
    const payload = input.slice(2);
    const padded = payload.length % 2 === 0 ? payload : [0, ...payload].join('');
    const hexArr: any[] = padded.match(/.{1,2}/g).map((x) => '0x' + x);
    const first = parseInt('0x80', 16) + hexArr.length;
    console.log('hexArr', hexArr);
    return Uint8Array.from([first, ...hexArr]);
  }

  if (typeof input === 'string') {
    // If a string of 0-55 byte length
    if (input.length <= 55) {
      const first = parseInt('0x80', 16) + input.length;
      const encodedInput = input.split('').map((c) => c.charCodeAt(0));
      return Uint8Array.from([first, ...encodedInput]);
    }
    // If a string of more than 55-byte length
    else if (input.length > 55) {
      const length = input.length;
      const ByteAmountToStoreLengthValue = removePrefix(input)
        .match(/.{1,2}/g)!
        .length.toString(16)
        .match(/.{1,2}/g)!.length;
      const first = parseInt('0xb7', 16) + ByteAmountToStoreLengthValue;
      const encodedInput = input.split('').map((c) => c.charCodeAt(0));
      return Uint8Array.from([first, length, ...encodedInput]);
    }
  } else if (Array.isArray(input)) {
    const output: Uint8Array[] = [];
    let payloadLength = 0;
    for (let element of input) {
      const encoded = encode(element);
      payloadLength += encoded.length;
    }

    // if a list of 0-55 bytes long
    if (payloadLength <= 55) {
    }

    // if a list of greater than 55-byte length
  }

  return Uint8Array.from([]);
}

// let cases = [
//   'dog',
//   ['cat', 'dog'],
//   null,
//   [],
//   0,
//   '\x00',
//   '\x0f',
//   '\x04\x00',
//   [[], [[]], [[], [[]]]],
//   'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
// ];

// Test Cases
// console.log(encode('dog'));
// console.log(encode(['cat', 'dog']));
// console.log(encode(null));
// console.log(encode([]));
// console.log(encode(0));
// console.log(encode('\x00'));
// console.log(encode('\x0f'));
// console.log(encode('\x04\00'));
// console.log(encode([[], [[]], [[], [[]]]]));
// console.log(encode('Lorem ipsum dolor sit amet, consectetur adipisicing elit'));

console.log('\x04\x00', encode('\x04\x00'), RLP.encode('\x04\x00'));
console.log('0x400', encode('0x400'), RLP.encode('0x400'));
console.log("'\x00'", encode('\x00'), RLP.encode('\x00'));
console.log("'0x7f7f'", encode('0x7f7f'), RLP.encode('0x7f7f'));

// for (let t of cases) {
//   // console.log(t, RLP.encode(t));
// }

export {};
