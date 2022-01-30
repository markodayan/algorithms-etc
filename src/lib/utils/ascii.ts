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
