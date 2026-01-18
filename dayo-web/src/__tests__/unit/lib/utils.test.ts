import { describe, it, expect } from 'vitest'
import { cn } from '../../../lib/utils'

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    expect(cn('base', isActive && 'active')).toBe('base active')
  })

  it('should handle false conditions', () => {
    const isActive = false
    expect(cn('base', isActive && 'active')).toBe('base')
  })

  it('should merge Tailwind classes correctly', () => {
    // twMerge should resolve conflicting Tailwind classes
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('should handle objects with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined)).toBe('')
  })

  it('should handle mixed inputs', () => {
    expect(cn(
      'base',
      { active: true, disabled: false },
      ['extra', 'classes'],
      undefined,
      'final'
    )).toBe('base active extra classes final')
  })
})
