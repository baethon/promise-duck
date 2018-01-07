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

const memoize = fn => {
  let results = {}

  return async () => Object.keys(results).length > 0
    ? memoizedResult(results)
    : memoizedResult(Object.assign(results, await resolveMemoize(fn)))
}

const promiseable = fn => async () => fn()

module.exports = { memoize, promiseable }
