import { describe, it, expect } from 'vitest'

describe('Math Utils', () => {
  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4)
  })

  it('should multiply numbers correctly', () => {
    expect(3 * 4).toBe(12)
  })

  it('should handle division', () => {
    expect(10 / 2).toBe(5)
  })
})

describe('String Utils', () => {
  it('should concatenate strings', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World')
  })

  it('should check string length', () => {
    expect('test').toHaveLength(4)
  })
})

describe('Array Utils', () => {
  it('should create arrays', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr[0]).toBe(1)
  })

  it('should filter arrays', () => {
    const numbers = [1, 2, 3, 4, 5]
    const evens = numbers.filter(n => n % 2 === 0)
    expect(evens).toEqual([2, 4])
  })
})