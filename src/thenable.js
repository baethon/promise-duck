const defaults = {
  resolve: value => value,
  reject: error => Promise.reject(error)
}

module.exports = fn => ({
  async then (resolve, reject = defaults.reject) {
    try {
      const result = await fn()
      resolve(result)
    } catch (error) {
      reject(error)
    }
  }
})
