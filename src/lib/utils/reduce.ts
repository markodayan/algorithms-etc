const mapByReduce = (arr: ArrType, fn: Fn) => {
  return arr.reduce((a, v) => a.concat(fn(v)), []);
};

const filterByReduce = (arr: ArrType, fn: Fn) => {
  return arr.reduce((a, v) => (fn(v) ? a.concat(v) : a), []);
};

const everyByReduce = (arr: ArrType, fn: Fn) => {
  return arr.reduce((a, v) => a && fn(v), true);
};

const someByReduce = (arr: ArrType, fn: Fn) => {
  return arr.reduce((a, v) => a || fn(v), false);
};

const findByReduce = (arr: ArrType, fn: Fn) => {
  return arr.reduce((a, v) => (a === undefined && fn(v) ? v : a), undefined);
};

const findIndexByReduce = (arr: ArrType, fn: Fn) => {
  return arr.reduce((a, v, i) => (a === -1 && fn(v) ? i : a), -1);
};

const flatByReduce = (arr: ArrType) => {
  return arr.reduce((a, v) => a.concat(v), []);
};

const deepFlattenByReduce: Fn = (arr: ArrType) => {
  return arr.reduce(
    (a, v) => a.concat(Array.isArray(v) ? deepFlattenByReduce(v) : v),
    []
  );
};

const reverseByReduce = (arr: ArrType): ArrType => {
  return arr.reduce((a, v) => [v, ...a], [] as ArrType);
};

export {
  mapByReduce,
  filterByReduce,
  everyByReduce,
  someByReduce,
  findByReduce,
  findIndexByReduce,
  flatByReduce,
  deepFlattenByReduce,
  reverseByReduce,
};
