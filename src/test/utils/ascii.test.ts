import { asciiToAlphanumeric, asciiReduce } from '@lib/utils/ascii';

describe('#ascii', () => {
  let arr = [99, 114, 121, 112, 116, 111, 123, 65, 83, 67, 73, 73, 95, 112, 114, 49, 110, 116, 52, 98, 108, 51, 125];

  it('Should covert an array of ascii numbers to the correct alphanumeric characters in string form', () => {
    let result = asciiToAlphanumeric(arr);
    expect(result).toBe('crypto{ASCII_pr1nt4bl3}');
  });

  it('Should covert an array of ascii numbers to the correct alphanumeric characters in string form (using functional reduce method)', () => {
    let result = asciiReduce(arr);
    expect(result).toBe('crypto{ASCII_pr1nt4bl3}');
  });
});
