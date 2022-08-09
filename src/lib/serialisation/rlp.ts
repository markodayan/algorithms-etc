import RLP from 'rlp';

type Input = string | number | bigint | Uint8Array | Array<Input> | null | undefined | any;

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

function hexToHexArray(input: string): string[] {
  return input.length % 2 === 0 ? input.match(/.{1,2}/g)! : ('0' + input).match(/.{1,2}/g)!;
}

function encode(input: Input): Uint8Array {
  /* (1) Base Cases */
  if (input === '') return Uint8Array.from([parseInt('0x80', 16)]);
  if (input === null) return Uint8Array.from([parseInt('0x80', 16)]);
  if (input === []) return Uint8Array.from([parseInt('0xc0', 16)]);

  /* (2) This block accomodates for integer values */
  if (typeof input === 'number') {
    // Base case for integer = 0
    if (input === 0) {
      return Uint8Array.from([parseInt('0x80', 16)]);
    } else if (input <= 255) {
      // For every other integer -> encode as Byte Array
      return Uint8Array.from([input]);
    } else {
      throw new Error('Integer > 255 supplied, unexpected and unhandled overflow wil occur - exit early');
    }
  }

  /* (3) This block accomodates for hexadecimal escape sequences */
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
    const padded = payload.length % 2 === 0 ? payload : '0' + payload;
    const hexArr: any[] = padded.match(/.{1,2}/g).map((x) => '0x' + x);
    const first = parseInt('0x80', 16) + hexArr.length;
    return Uint8Array.from([first, ...hexArr]);
  }

  /* (4) This block accomodates for string values */
  if (typeof input === 'string') {
    // If a string of 0-55 byte length
    if (input.length <= 55) {
      const first = parseInt('0x80', 16) + input.length;
      const encodedInput = input.split('').map((c) => c.charCodeAt(0));
      return Uint8Array.from([first, ...encodedInput]);
    }
    // If a string of more than 55-byte length
    else if (input.length > 55) {
      const lengthInBytes = removePrefix(input).length.toString(16);
      const ByteAmountToStoreLengthValue: any = hexToHexArray(lengthInBytes);
      const first = parseInt('0xb7', 16) + ByteAmountToStoreLengthValue.length;
      const encodedInput = input.split('').map((c) => c.charCodeAt(0));
      return Uint8Array.from([first, ...ByteAmountToStoreLengthValue.map((b) => parseInt(b, 16)), ...encodedInput]);
    }
  }

  /* (5) This block accomodates for array types */
  if (Array.isArray(input)) {
    const payloadEncoding = [];
    let payloadLength = 0;

    for (let element of input) {
      const encoded = encode(element);
      payloadEncoding.push(...encoded);
      payloadLength += encoded.length;
    }

    // if a list of 0-55 bytes long
    if (payloadLength <= 55) {
      const first = parseInt('0xc0', 16) + payloadLength;
      return Uint8Array.from([first, ...payloadEncoding]);
    }

    // if a list of greater than 55-byte length
    if (payloadLength > 55) {
      const lengthInHex = payloadLength.toString(16);
      const ByteAmountToStoreLengthValue = hexToHexArray(lengthInHex);
      const first = parseInt('0xf7', 16) + ByteAmountToStoreLengthValue.length;
      return Uint8Array.from([first, ...ByteAmountToStoreLengthValue.map((b) => parseInt(b, 16)), ...payloadEncoding]);
    }
  }

  throw new Error(
    'Unhandled input payload (if bigint payload, then encode method requires an update) - no encoding scheme available (perhaps stringify or encode as a list)'
  );
}

let cases = [
  'dog',
  ['cat', 'dog'],
  null,
  [],
  0,
  '\x00',
  '\x0f',
  '\x04\x00',
  [[], [[]], [[], [[]]]],
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
];

// for (let c of cases) {
//   let me = encode(c);
//   let lib = RLP.encode(c);

//   console.log(c, me.toString() === lib.toString());
// }

// import { testArr } from '@src/junk/rlp-encode';
// console.log('geth test cases');
// let tests = testArr.slice(4);
// for (let t of tests) {
//   let me = encode(t);
//   let lib = RLP.encode(t as any);

//   console.log(t, me.toString() === lib.toString());
// }

let example = ['zw', [4], 1];
let me = encode(example);
let lib = RLP.encode(example);

console.log(me);
console.log(lib);

for (let i = 0; i < 20; i++) {
  console.log(i, encode(i), RLP.encode(i));
}

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

// const longstring =
//   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mauris magna, suscipit sed vehicula non, iaculis faucibus tortor. Proin suscipit ultricies malesuada. Duis tortor elit, dictum quis tristique eu, ultrices at risus. Morbi a est imperdiet mi ullamcorper aliquet suscipit nec lorem. Aenean quis leo mollis, vulputate elit varius, consequat enim. Nulla ultrices turpis justo, et posuere urna consectetur nec. Proin non convallis metus. Donec tempor ipsum in mauris congue sollicitudin. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse convallis sem vel massa faucibus, eget lacinia lacus tempor. Nulla quis ultricies purus. Proin auctor rhoncus nibh condimentum mollis. Aliquam consequat enim at metus luctus, a eleifend purus egestas. Curabitur at nibh metus. Nam bibendum, neque at auctor tristique, lorem libero aliquet arcu, non interdum tellus lectus sit amet eros. Cras rhoncus, metus ac ornare cursus, dolor justo ultrices metus, at ullamcorper volutpat';

// console.log('\x04\x00', encode('\x04\x00'), RLP.encode('\x04\x00'));
// console.log('0x400', encode('0x400'), RLP.encode('0x400'));
// console.log("'\x00'", encode('\x00'), RLP.encode('\x00'));
// console.log('0x7f7f7f7', encode('0x7f7f7f7'), RLP.encode('0x7f7f7f7'));
// console.log(`['cat', 'dog']`, encode(['cat', 'dog']), RLP.encode(['cat', 'dog']));
// console.log(encode(['cat', 'dog']).toString() === RLP.encode(['cat', 'dog']).toString());
// console.dir(encode(longstring), { maxArrayLength: null });
// console.dir(RLP.encode(longstring), { maxArrayLength: null });
// let me = encode(longstring);
// let lib = RLP.encode(longstring);

// let allEqual = false;

// for (let i = 0; i < 1024; i++) {
//   allEqual = lib[i] === me[i];
// }

// console.log('1st equality method', me.toString() === lib.toString());
// console.log('2nd equality method', allEqual);

// for (let t of cases) {
//   // console.log(t, RLP.encode(t));
// }

// let longlist = [
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
//   ['asdf', 'qwer', 'zxcv'],
// ];

// console.log(encode(longlist));

// console.log(RLP.encode(longlist));

// console.log('longlist:', encode(longlist).toString() === RLP.encode(longlist).toString());

export { encode };
