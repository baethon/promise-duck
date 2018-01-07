const { expect } = require('chai')
const { thenable } = require('../')

const fn = () => 'foo'
const failingFn = () => {
  throw new Error(':o')
}

const asyncFn = fn => () => new Promise((resolve, reject) => {
  const wrapper = () => {
    try {
      resolve(fn())
    } catch (error) {
      reject(error)
    }
  }

  setTimeout(wrapper, 0)
})

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

  describe('async', () => {
    it('resolves value', async () => {
      const p = thenable(asyncFn(fn))
      expect(await p).to.equal('foo')
    })

    it('rejects on error', (done) => {
      const p = thenable(asyncFn(failingFn))

      p.then(
        _ => done('promise should not resolve'),
        _ => done()
      )
    })
  })

  describe('assign', () => {
    it('mutates given object', async () => {
      const obj = {
        name: 'Jon',
        hello () {
          return `Hai ${this.name}`
        }
      }

      thenable.assign(obj, obj.hello.bind(obj))

      expect(await obj).to.equal('Hai Jon')
    })

    it('allows to pass multiple objects', async () => {
      const obj = { name: 'Jon' }
      const result = thenable.assign({}, obj, function () {
        return `Hai ${obj.name}`
      })

      expect(result).not.to.equal(obj)
      expect(result).has.property('name', 'Jon')
      expect(await result).to.equal('Hai Jon')
    })
  })
})
