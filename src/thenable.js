const wrapper = require('./wrapper')

module.exports = (fn, { memoize = true } = {}) => {
  const wrappedFn = memoize ? wrapper.memoize(fn) : wrapper.promiseable(fn)

  return {
    then (resolve, reject = Promise.reject) {
      return wrappedFn()
        .then(resolve, reject)
    }
  }
}
