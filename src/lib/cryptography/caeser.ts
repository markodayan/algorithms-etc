const toUpper = (char: string) => char.toUpperCase();
const isAlphabetical = (code: number) => code >= 65 && code <= 122;
const isUpperCase = (code: number) => code >= 65 && code <= 90;
const isLowerCase = (code: number) => code >= 97 && code <= 122;

const getCipherShiftedChar = (code: number, shift: number) => {
  let newCode;

  if (shift > 0) {
    if (isUpperCase(code)) {
      newCode = code + shift > 90 ? code + shift - 26 : code + shift;
    } else {
      newCode = code + shift > 122 ? code + shift - 26 : code + shift;
    }
  } else {
    if (isUpperCase(code)) {
      newCode = code + shift < 65 ? code + shift + 26 : code + shift;
    } else {
      newCode = code + shift < 97 ? code + shift + 26 : code + shift;
    }
  }

  return String.fromCharCode(newCode);
};

const caeserCipher = (secret: string, s: number) => {
  const shift = s >= 26 ? s - Math.floor(s / 26) * 26 : s;

  let solution = [];
  let arr = secret.split(' ');

  for (let i = 0; i < arr.length; i++) {
    let word = arr[i].split('').reduce((acc, v, i) => {
      let code = v.toString().charCodeAt(0);

      if (!isAlphabetical(code)) {
        return acc + v;
      }

      return acc + getCipherShiftedChar(code, shift);
    }, '');

    solution.push(word);
  }

  return solution.join(' ');
};

export { caeserCipher };
