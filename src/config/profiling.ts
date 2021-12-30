const addLogging =
  (fn: Fn) =>
  (...args: IArgs) => {
    console.log('Enter', fn.name, ...args);
    try {
      const toReturn = fn(...args);
      console.log('Exit ', fn.name, toReturn);
      return toReturn;
    } catch (err) {
      console.log('Error', fn.name, err);
      throw err;
    }
  };

const addTiming =
  (fn: Fn) =>
  (...args: IArgs) => {
    let start = performance.now();
    try {
      const toReturn = fn(...args);
      console.log('Exit', fn.name, performance.now() - start, 'ms');
      return toReturn;
    } catch (thrownError) {
      console.log('Exception', fn.name, performance.now() - start, 'ms');
      throw thrownError;
    }
  };

export { addLogging, addTiming };
