import { describe, it, expect } from 'vitest'
import {
  adultTemplates,
  kidsTemplates,
  getTemplatesForMode,
  getTemplateById,
  isFrewriteTemplate,
} from '../templates'

describe('templates', () => {
  describe('adultTemplates', () => {
    it('should have 5 adult templates', () => {
      expect(adultTemplates).toHaveLength(5)
    })

    it('should have unique ids', () => {
      const ids = adultTemplates.map(t => t.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('should include a freewrite template', () => {
      const freewrite = adultTemplates.find(t => t.id === 'freewrite')
      expect(freewrite).toBeDefined()
      expect(freewrite!.sections).toHaveLength(0)
    })

    it('each template should have name, icon, and description', () => {
      adultTemplates.forEach(template => {
        expect(template.name).toBeTruthy()
        expect(template.icon).toBeTruthy()
        expect(template.description).toBeTruthy()
      })
    })

    it('morning intention should have 3 sections', () => {
      const morning = adultTemplates.find(t => t.id === 'morning-intention')
      expect(morning).toBeDefined()
      expect(morning!.sections).toHaveLength(3)
    })

    it('sections should have required fields', () => {
      adultTemplates.forEach(template => {
        template.sections.forEach(section => {
          expect(section.id).toBeTruthy()
          expect(section.label).toBeTruthy()
          expect(section.prompt).toBeTruthy()
          expect(section.placeholder).toBeTruthy()
          expect(['text', 'list']).toContain(section.type)
        })
      })
    })
  })

  describe('kidsTemplates', () => {
    it('should have 3 kids templates', () => {
      expect(kidsTemplates).toHaveLength(3)
    })

    it('should have unique ids', () => {
      const ids = kidsTemplates.map(t => t.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('should include a free write template', () => {
      const freewrite = kidsTemplates.find(t => t.id === 'freewrite-kids')
      expect(freewrite).toBeDefined()
      expect(freewrite!.sections).toHaveLength(0)
    })

    it('all templates should have kid mode', () => {
      kidsTemplates.forEach(template => {
        expect(template.mode).toBe('kid')
      })
    })
  })

  describe('getTemplatesForMode', () => {
    it('should return adult templates when not kids mode', () => {
      const templates = getTemplatesForMode(false)
      expect(templates).toBe(adultTemplates)
    })

    it('should return kids templates when kids mode', () => {
      const templates = getTemplatesForMode(true)
      expect(templates).toBe(kidsTemplates)
    })
  })

  describe('getTemplateById', () => {
    it('should find adult template by id', () => {
      const template = getTemplateById('morning-intention')
      expect(template).toBeDefined()
      expect(template!.name).toBe('Morning Intention')
    })

    it('should find kids template by id', () => {
      const template = getTemplateById('adventure-log')
      expect(template).toBeDefined()
      expect(template!.name).toBe('Adventure Log')
    })

    it('should return undefined for unknown id', () => {
      const template = getTemplateById('nonexistent')
      expect(template).toBeUndefined()
    })
  })

  describe('isFrewriteTemplate', () => {
    it('should return true for freewrite', () => {
      expect(isFrewriteTemplate('freewrite')).toBe(true)
    })

    it('should return true for freewrite-kids', () => {
      expect(isFrewriteTemplate('freewrite-kids')).toBe(true)
    })

    it('should return false for other templates', () => {
      expect(isFrewriteTemplate('morning-intention')).toBe(false)
    })
  })
})
