import { caeserCipher } from '@lib/cryptography/caeser';

describe('#caeserCipher', () => {
  const secret = 'MERCY ESTATE TASK PRODUCE';

  it('Should encrypt a secret via length 20 caeser cipher shift', () => {
    let result = caeserCipher(secret, 20);
    expect(result).toBe('GYLWS YMNUNY NUME JLIXOWY');
  });

  it('should encrypt a secret via a caeser cipher right shift of 9 (and repeatedly compute the same encrypted output for any offset of 26 from this shift value of 9)', () => {
    let res1 = caeserCipher('MERCY ESTATE TASK PRODUCE', 9); // right shift of 9
    let res2 = caeserCipher('MERCY ESTATE TASK PRODUCE', 35); // right shift of 35
    let res3 = caeserCipher('MERCY ESTATE TASK PRODUCE', -17); // left shift of 17

    expect(res1).toBe('VNALH NBCJCN CJBT YAXMDLN');
    expect(res2).toBe(res1);
    expect(res3).toBe(res1);
  });
});
