import { describe, it, expect } from 'vitest'
import { eager } from '../src/index'

describe('eager', () => {
  function makePromise<T>(data: T): Promise<T> {
    return new Promise((resolve) => resolve(data))
  }

  it('Makes a property on an object accessible', async () => {
    const eagerPromise = eager(makePromise({ a: 1 }))

    expect(await eagerPromise.a).toBe(1)
  })

  it('Works for an array element', async () => {
    const eagerPromise = eager(makePromise([1, 2, 3]))

    expect(await eagerPromise[0]).toBe(1)
    expect(await eagerPromise[1]).toBe(2)
  })

  it('Supports method calls', async () => {
    const eagerPromise = eager(makePromise([1, 2, 3]))

    expect(await eagerPromise.map((e) => e + 1)).toEqual([2, 3, 4])
  })
})