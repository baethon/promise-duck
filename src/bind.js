const thenable = require('./thenable')

/**
 * Assign given thenable function
 *
 * @param   {Function} fn thenable callback
 * @param   {Object}   options
 * @param   {Boolean}  options.memoize [true] should the result of `fn` be memoized
 * @returns {Object}
 */
module.exports = (fn, options = {}) => ({

  /**
   * Mutate given object with thenable object
   *
   * @param  {Object} object
   * @return {Object}
   */
  to: (object) => {
    Object.assign(object, thenable(fn.bind(object), options))
  }
})
