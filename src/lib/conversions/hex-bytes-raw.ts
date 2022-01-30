interface IHexMap {
  [key: string]: number;
}

const HEX_STRINGS = '0123456789abcdef';
const MAP_HEX: IHexMap = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
};

/**
 * Fast Uint8Array to hexadecimal
 * @param {Uint8Array} - bytes
 * @returns {String} - hex
 */
const toHex = (bytes: Uint8Array) => {
  return Array.from(bytes || [])
    .map((b) => HEX_STRINGS[b >> 4] + HEX_STRINGS[b & 15])
    .join('');
};

/**
 * Hexadecimal to Uint8Array (Mimics Buffer.from(x, 'hex') logic)
 * @param {String} - hex
 * @returns {Uint8Array} - bytes
 */
const fromHex = (hex: string) => {
  const bytes = new Uint8Array(Math.floor((hex || '').length / 2));
  let i;
  for (i = 0; i < bytes.length; i++) {
    const a = MAP_HEX[hex[i * 2]];
    const b = MAP_HEX[hex[i * 2 + 1]];
    if (a === undefined || b === undefined) {
      break;
    }

    bytes[i] = (a << 4) | b;
  }

  return i === bytes.length ? bytes : bytes.slice(0, i);
};

export { toHex, fromHex };
