const wrapper = require('./wrapper')

/**
 * Converts given function to thenable object
 *
 * @param  {Function} fn
 * @param  {Object}   options
 * @param  {Boolean}  options.memoize [true] should the result of fn be memoized
 * @return {Object}
 */
module.exports = (fn, { memoize = true } = {}) => {
  const wrappedFn = memoize ? wrapper.memoize(fn) : wrapper.promiseable(fn)

  return {
    then (resolve, reject = Promise.reject) {
      return wrappedFn()
        .then(resolve, reject)
    }
  }
}
