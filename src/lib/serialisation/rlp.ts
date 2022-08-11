import RLP from 'rlp';

type Input = string | number | bigint | Uint8Array | Array<Input> | null | undefined | any;
type NestedUint8Array = Array<Uint8Array | NestedUint8Array>;

interface Decoded {
  data: Uint8Array | NestedUint8Array;
  remaining: Uint8Array;
}

//////////////////////////////////  Encoding Internal Methods /////////////////////////////////////////////
/** Method to detect if string is prefixed with '0x' and slice it from the input (returns the string unaltered otherwise) */
function stripHexPrefix(input: string): string {
  if (input.startsWith('0x')) {
    input = input.slice(2);
  }

  return input;
}

/** Method to detect whether input is escaped hexadecimal sequence */
function isEscapedFormat(input: Input): boolean {
  if (typeof input === 'string') {
    return encodeURI(input[0]).startsWith('%');
  }

  return false;
}

/** Method to convert hex string to a byte array */
function hexToByteArray(input: string): Uint8Array {
  let arr: string[] =
    input.length % 2 === 0 ? (input.match(/.{1,2}/g)! as string[]) : (('0' + input).match(/.{1,2}/g)! as string[]);

  return Uint8Array.from(arr.map((b) => parseInt(b, 16) as never));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function encode(input: Input): Uint8Array {
  /* (1) Base Cases */
  if (input === '') return Uint8Array.from([parseInt('0x80', 16)]);
  if (input === null) return Uint8Array.from([parseInt('0x80', 16)]);
  if (input === []) return Uint8Array.from([parseInt('0xc0', 16)]);

  /* (2) This block accomodates for integer values */
  if (typeof input === 'number') {
    if (input < 0) {
      throw new Error('Integer must be unsigned (provide decimal value greater than or equal to 0');
    }

    // Base case for integer = 0
    if (input === 0) {
      return Uint8Array.from([parseInt('0x80', 16)]);
    } else if (input <= 127) {
      return Uint8Array.from([input]);
    } else {
      // For all integers above 127, the first byte offset is applied
      const bytes = hexToByteArray(input.toString(16));
      const first = parseInt('0x80', 16) + bytes.length;
      return Uint8Array.from([first, ...bytes]);
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
      const lengthInBytes = stripHexPrefix(input).length.toString(16);
      const ByteAmountToStoreLengthValue: Uint8Array = hexToByteArray(lengthInBytes);
      const first = parseInt('0xb7', 16) + ByteAmountToStoreLengthValue.length;
      const encodedInput = input.split('').map((c) => c.charCodeAt(0));
      return Uint8Array.from([first, ...ByteAmountToStoreLengthValue, ...encodedInput]);
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
      const ByteAmountToStoreLengthValue: Uint8Array = hexToByteArray(lengthInHex);
      const first = parseInt('0xf7', 16) + ByteAmountToStoreLengthValue.length;
      return Uint8Array.from([first, ...ByteAmountToStoreLengthValue, ...payloadEncoding]);
    }
  }

  throw new Error(
    'Unhandled input payload (if bigint payload, then encode method requires an update) - no encoding scheme available (perhaps stringify or encode as a list)'
  );
}

//////////////////////////////////  Decoding Internal Methods /////////////////////////////////////////////
/** Converts byte array to acceptable hex string input format for RLP-decoding (byte values are converted the hexadecimal format where single digits are padded with 0 and 0x-prefix is added to the hexadecimal number) */
function bytesToHexString(bytes: Uint8Array): string {
  let payload = '0x';

  for (let byte of bytes) {
    payload += byte.toString(16).padStart(2, '0');
  }

  if (payload === '0x') {
    payload += '0';
  }

  return payload;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function decode(encoded: Input): Uint8Array | NestedUint8Array {
  if (!encoded || encoded?.length === 0) {
    return Uint8Array.from([]);
  }

  return _decode(encoded).data;
}

function _decode(encoded: Input): Decoded {
  const first = encoded[0];

  switch (true) {
    // payload is a string which is 1 byte in size.
    case first >= 0 && first <= 127: {
      const decoded = encoded.slice(0, 1);

      return {
        data: decoded,
        remaining: encoded.slice(1),
      };
    }

    // payload is a string smaller than or equal to 55 bytes in size.
    case first >= 128 && first <= 183: {
      // range of first byte is between value 128 and 183 (hence min length is 1 byte)
      const length = first - 127;
      let decoded;

      // edge case (byte value = 128 (0x80))
      if (first === 128) {
        decoded = Uint8Array.from([]);
      } else {
        decoded = Uint8Array.from([...encoded.slice(1, length)]);
      }

      return {
        data: decoded,
        remaining: encoded.slice(length),
      };
    }

    // payload is a string bigger than 55 bytes in size.
    case first >= 184 && first <= 191: {
      const length = first - 183;
      const payloadLengthInHex = bytesToHexString(encoded.slice(1, 1 + length));
      const payloadLength = parseInt(payloadLengthInHex, 16);

      const decoded = Uint8Array.from([...encoded.slice(1 + length, 1 + length + payloadLength)]);

      return {
        data: decoded,
        remaining: encoded.slice(1 + length + payloadLength),
      };
    }

    // payload is a list where its contents are smaller than or equal to 55 bytes in size
    case first >= 192 && first <= 247: {
      const decoded = [];
      // range of first byte is between value 192 and 247 (hence min length is 1 byte)
      const payloadLength = first - 191;
      let encodedPayload = encoded.slice(1, payloadLength);

      while (encodedPayload.length > 0) {
        let { data, remaining } = _decode(encodedPayload);
        decoded.push(data);

        if (!remaining) {
          break;
        }

        encodedPayload = remaining;
      }

      return {
        data: decoded,
        remaining: encoded.slice(payloadLength),
      };
    }

    // payload is a list where its contents are bigger than 55 bytes in size
    case first >= 248 && first <= 255: {
      const decoded = [];
      const bytesToStorePayloadLengthValue = first - 247;
      const payloadLengthInHex = bytesToHexString(encoded.slice(1, 1 + bytesToStorePayloadLengthValue));
      const payloadLength = parseInt(payloadLengthInHex, 16);

      let encodedPayload = Uint8Array.from([
        ...encoded.slice(1 + bytesToStorePayloadLengthValue, 1 + bytesToStorePayloadLengthValue + payloadLength),
      ]);

      while (encodedPayload.length > 0) {
        let { data, remaining } = _decode(encodedPayload);
        decoded.push(data);

        if (!remaining) {
          break;
        }

        encodedPayload = remaining;
      }

      return {
        data: decoded,
        remaining: encoded.slice(1 + bytesToStorePayloadLengthValue + payloadLength),
      };
    }

    default:
      throw new Error('Invalid first byte for RLP encoded input');
  }
}

export { encode, decode };
