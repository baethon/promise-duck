const wrapper = require('./wrapper')

const thenable = (fn, { memoize = true } = {}) => {
  const wrappedFn = memoize ? wrapper.memoize(fn) : wrapper.promiseable(fn)

  return {
    then (resolve, reject = Promise.reject) {
      return wrappedFn()
        .then(resolve, reject)
    }
  }
}

thenable.assign = (...args) => {
  const fn = args.pop()
  args.push(thenable(fn))

  return Object.assign(...args)
}

module.exports = thenable
