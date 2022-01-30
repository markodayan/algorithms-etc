/**
 * Convert hex value to Uint8Array (Decimal)
 * @param {String} - address (e.g. 001d3f1ef827552ae1114027bd3ecf1f086ba0f9)
 * @returns {Uint8Array}
 */
const hexToBytes = (address: string) => {
  // equiv to -> new Uint8Array(Buffer.from(address, 'hex'))
  return Uint8Array.from(Buffer.from(address, 'hex'));
};

/**
   * Convert Uint8Array to hex value
   * @param {Uint8Array} - bytesArr (e.g. Uint8Array(20) [
      0,  29, 63,  30, 248,  39, 85,
     42, 225, 17,  64,  39, 189, 62,
    207,  31,  8, 107, 160, 249
  ]
   * @returns {String}
   */
const bytesToHex = (bytesArr: Uint8Array) => {
  return Buffer.from(bytesArr).toString('hex');
};

export { hexToBytes, bytesToHex };
