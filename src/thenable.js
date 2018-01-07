const defaults = {
  resolve: value => value,
  reject: error => Promise.reject(error)
}

const memoizedResult = results => {
  if ('error' in results) {
    throw results.error
  }

  return results.value
}

const resolveMemoize = async fn => {
  try {
    const value = await fn()
    return { value }
  } catch (error) {
    return { error }
  }
}

const wrappers = {
  memoize: fn => {
    let results = {}

    return async () => Object.keys(results).length > 0
      ? memoizedResult(results)
      : memoizedResult(Object.assign(results, await resolveMemoize(fn)))
  },
  promiseable: fn => async () => fn()
}

module.exports = (fn, { memoize = true } = {}) => {
  const wrappedFn = memoize ? wrappers.memoize(fn) : wrappers.promiseable(fn)

  return {
    then (resolve = defaults.resolve, reject = defaults.reject) {
      return wrappedFn()
        .then(resolve, reject)
    }
  }
}
