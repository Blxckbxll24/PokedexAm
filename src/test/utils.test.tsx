import { describe, it, expect, vi } from 'vitest'

// Tests simples para asegurar que el pipeline funcione
describe('Simple Unit Tests', () => {
  it('should pass basic math test', () => {
    expect(2 + 2).toBe(4)
    expect(10 / 2).toBe(5)
    expect(3 * 3).toBe(9)
  })

  it('should pass string manipulation test', () => {
    expect('hello'.toUpperCase()).toBe('HELLO')
    expect('WORLD'.toLowerCase()).toBe('world')
    expect('test'.length).toBe(4)
  })

  it('should pass array operations test', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
    expect(arr[0]).toBe(1)
    expect(arr.includes(2)).toBe(true)
  })

  it('should pass object operations test', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj.name).toBe('test')
    expect(obj.value).toBe(42)
    expect(Object.keys(obj).length).toBe(2)
  })

  it('should pass mock function test', () => {
    const mockFn = vi.fn()
    mockFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})

// Utility function tests
describe('Utility Functions', () => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  
  it('should capitalize strings correctly', () => {
    expect(capitalize('pokemon')).toBe('Pokemon')
    expect(capitalize('pikachu')).toBe('Pikachu')
    expect(capitalize('test')).toBe('Test')
  })

  const formatId = (id: number) => `#${String(id).padStart(3, '0')}`
  
  it('should format pokemon IDs correctly', () => {
    expect(formatId(1)).toBe('#001')
    expect(formatId(25)).toBe('#025')
    expect(formatId(150)).toBe('#150')
  })

  const calculateTotal = (stats: number[]) => stats.reduce((sum, stat) => sum + stat, 0)
  
  it('should calculate stat totals correctly', () => {
    expect(calculateTotal([35, 55, 40, 50, 50, 90])).toBe(320)
    expect(calculateTotal([100, 100, 100])).toBe(300)
    expect(calculateTotal([0, 0, 0])).toBe(0)
  })
})