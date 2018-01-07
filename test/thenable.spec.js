const { expect } = require('chai')
const { thenable } = require('../')

const fn = () => 'foo'
const failingFn = () => {
  throw new Error(':o')
}

describe('promise-duck | thenable', () => {
  it('converts fn to thenable object', (done) => {
    const p = thenable(fn)

    p.then(value => {
      expect(value).to.equal('foo')
      done()
    })
  })

  it('rejects promise on error', (done) => {
    const p = thenable(failingFn)

    p.then(
      _ => done(new Error('promise should not resolve')),
      _ => done()
    )
  })

  it('can be used with await keyword', async () => {
    const p = thenable(fn)
    const value = await p

    expect(value).to.equal('foo')
  })

  describe('memoize', () => {
    it('memoizes resolved value', async () => {
      const p = thenable(Math.random)
      const value = await p

      expect(await p).to.equal(value)
    })

    it('allows to disable memoize', async () => {
      const p = thenable(Math.random, { memoize: false })

      expect(await p).not.to.equal(await p)
    })

    it('throws error for memoized fn', async () => {
      const p = thenable(failingFn)
      let error
      let secondError

      try {
        await p
      } catch (e) {
        error = e
      }

      try {
        await p
      } catch (e) {
        secondError = e
      }

      expect(secondError).to.be.equal(error)
    })
  })
})
