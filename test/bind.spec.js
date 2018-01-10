const { expect } = require('chai')
const { bind } = require('../')

describe('promise-duck | bind', () => {
  it('binds callback to object', async () => {
    const object = { name: 'Jon' }
    const hello = function () {
      return `Hai ${this.name}`
    }

    bind(hello).to(object)

    const value = await object

    expect(value).to.equal('Hai Jon')
  })

  it('allows to pass options', async () => {
    const object = { name: 'Jon' }
    const hello = function () {
      return `Hai ${this.name} ${Math.random()}`
    }

    bind(hello, { memoize: false }).to(object)

    expect(await object).not.to.equal(await object)
  })

  it('returns extended object', () => {
    const object = { name: 'Jon' }
    const hello = function () {
      return `Hai ${this.name} ${Math.random()}`
    }

    const result = bind(hello, { memoize: false }).to(object)

    expect(result).to.equal(object)
  })
})
