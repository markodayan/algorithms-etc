import { decodeIntegerMessage } from '@src/lib/cryptography/bytes';

describe('#decodeIntegerMessage', () => {
  const code = '11515195063862318899931685488813747395775516287289682636499965282714637259206269';

  it('Should decode a message correctly from its integer form (it should be able to handle large numbers with extreme precision for decoding)', () => {
    const decoded = decodeIntegerMessage(code);
    expect(decoded).toBe('crypto{3nc0d1n6_4ll_7h3_w4y_d0wn}');
  });
});
