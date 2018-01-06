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

  it('marks promise as rejected for failing fn', (done) => {
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
})
