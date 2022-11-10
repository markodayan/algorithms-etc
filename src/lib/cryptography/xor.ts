function xor(a: string, b: string) {
  let x;
  let y;

  if (!a.startsWith('0x') || !b.startsWith('0x')) {
    x = BigInt('0x' + a);
    y = BigInt('0x' + b);
  } else {
    x = BigInt(a.slice(2));
    y = BigInt(b.slice(2));
  }

  return (x ^ y).toString(16);
}

export { xor };
