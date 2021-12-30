const pipeline = (...fns: Fn[]) =>
  fns.reduce(
    (result, f) =>
      (...args) =>
        f(result(...args))
  );

const map = (fn: Fn) => (arr: ArrType) => arr.map(fn);

export { pipeline, map };
