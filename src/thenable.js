const wrapper = require('./wrapper')

const defaults = {
  resolve: value => value,
  reject: error => Promise.reject(error)
}

module.exports = (fn, { memoize = true } = {}) => {
  const wrappedFn = memoize ? wrapper.memoize(fn) : wrapper.promiseable(fn)

  return {
    then (resolve = defaults.resolve, reject = defaults.reject) {
      return wrappedFn()
        .then(resolve, reject)
    }
  }
}
