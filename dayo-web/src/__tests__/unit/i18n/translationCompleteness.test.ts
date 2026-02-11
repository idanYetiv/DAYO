import { describe, it, expect } from 'vitest'
import enCommon from '../../../i18n/locales/en/common.json'
import heCommon from '../../../i18n/locales/he/common.json'

/**
 * Recursively gets all keys from an object, using dot notation for nested keys
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

/**
 * Gets the value at a dot-notation path in an object
 */
function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }

  return current
}

describe('Translation Completeness', () => {
  const enKeys = getAllKeys(enCommon as Record<string, unknown>)
  const heKeys = getAllKeys(heCommon as Record<string, unknown>)

  describe('Hebrew translations', () => {
    it('should have all keys that exist in English', () => {
      const missingInHebrew = enKeys.filter(key => !heKeys.includes(key))

      if (missingInHebrew.length > 0) {
        console.log('\n🔴 Missing Hebrew translations:')
        missingInHebrew.forEach(key => {
          const enValue = getValueAtPath(enCommon as Record<string, unknown>, key)
          console.log(`  - ${key}: "${enValue}"`)
        })
      }

      expect(missingInHebrew).toEqual([])
    })
  })

  describe('English translations', () => {
    it('should have all keys that exist in Hebrew', () => {
      const missingInEnglish = heKeys.filter(key => !enKeys.includes(key))

      if (missingInEnglish.length > 0) {
        console.log('\n🔴 Missing English translations:')
        missingInEnglish.forEach(key => {
          const heValue = getValueAtPath(heCommon as Record<string, unknown>, key)
          console.log(`  - ${key}: "${heValue}"`)
        })
      }

      expect(missingInEnglish).toEqual([])
    })
  })

  describe('Translation values', () => {
    it('should not have empty string values in English', () => {
      const emptyKeys = enKeys.filter(key => {
        const value = getValueAtPath(enCommon as Record<string, unknown>, key)
        return value === ''
      })

      if (emptyKeys.length > 0) {
        console.log('\n🔴 Empty English translations:')
        emptyKeys.forEach(key => console.log(`  - ${key}`))
      }

      expect(emptyKeys).toEqual([])
    })

    it('should not have empty string values in Hebrew', () => {
      const emptyKeys = heKeys.filter(key => {
        const value = getValueAtPath(heCommon as Record<string, unknown>, key)
        return value === ''
      })

      if (emptyKeys.length > 0) {
        console.log('\n🔴 Empty Hebrew translations:')
        emptyKeys.forEach(key => console.log(`  - ${key}`))
      }

      expect(emptyKeys).toEqual([])
    })

    it('should have Hebrew translations that are not identical to English (excluding technical terms)', () => {
      // Keys that are expected to be the same in both languages
      const technicalTerms = [
        'appName',
        'nav.ai',
      ]

      const identicalKeys = enKeys.filter(key => {
        if (technicalTerms.includes(key)) return false

        const enValue = getValueAtPath(enCommon as Record<string, unknown>, key)
        const heValue = getValueAtPath(heCommon as Record<string, unknown>, key)

        // Skip arrays (like weekDays)
        if (Array.isArray(enValue) || Array.isArray(heValue)) return false

        return enValue === heValue
      })

      if (identicalKeys.length > 0) {
        console.log('\n⚠️  Potentially untranslated (identical to English):')
        identicalKeys.forEach(key => {
          const value = getValueAtPath(enCommon as Record<string, unknown>, key)
          console.log(`  - ${key}: "${value}"`)
        })
      }

      // This is a warning, not a failure - some values might legitimately be the same
      // But we log them for manual review
    })
  })

  describe('Translation key statistics', () => {
    it('should report translation statistics', () => {
      console.log('\n📊 Translation Statistics:')
      console.log(`  English keys: ${enKeys.length}`)
      console.log(`  Hebrew keys: ${heKeys.length}`)

      const commonKeys = enKeys.filter(key => heKeys.includes(key))
      console.log(`  Common keys: ${commonKeys.length}`)

      const coverage = ((commonKeys.length / enKeys.length) * 100).toFixed(1)
      console.log(`  Hebrew coverage: ${coverage}%`)

      expect(true).toBe(true) // Always pass, just for reporting
    })
  })
})
