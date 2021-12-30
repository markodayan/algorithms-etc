const memoize = (fn: Fn) => {
  const cache = new Map();
  return (n: IKey) => {
    if (!cache.has(n)) {
      cache.set(n, fn(n));
    }

    return cache.get(n);
  };
};

const genericMemoize = (fn: Fn) => {
  const cache = new Map();
  return (...args: IKey[]) => {
    const strX = JSON.stringify(args);
    if (!cache.has(strX)) {
      cache.set(strX, fn(...args));
    }
    return cache.get(strX);
  };
};

export { memoize, genericMemoize };
