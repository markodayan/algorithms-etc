const asciiToAlphanumeric = (arr: number[]) => {
  let solution = [];

  for (let i = 0; i < arr.length; i++) {
    let code = arr[i];
    solution.push(String.fromCharCode(code));
  }

  return solution.join('');
};

const predicate = (acc: string[], v: number, i: number) => {
  acc.push(String.fromCharCode(v));
  return acc;
};

const asciiReduce = (arr: number[]): string => arr.reduce(predicate, []).join('');

export { asciiToAlphanumeric, asciiReduce };

let arr = [99, 114, 121, 112, 116, 111, 123, 65, 83, 67, 73, 73, 95, 112, 114, 49, 110, 116, 52, 98, 108, 51, 125];

console.log(asciiToAlphanumeric(arr));
console.log(asciiReduce(arr));
