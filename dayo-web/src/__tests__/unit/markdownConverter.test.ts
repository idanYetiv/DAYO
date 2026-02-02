import { describe, it, expect } from 'vitest'
import { markdownToHtml, htmlToMarkdown } from '../../lib/markdownConverter'

describe('markdownConverter', () => {
  describe('markdownToHtml', () => {
    it('returns empty paragraph for empty string', () => {
      expect(markdownToHtml('')).toBe('<p></p>')
    })

    it('wraps plain text in paragraphs', () => {
      const result = markdownToHtml('Hello world')
      expect(result).toContain('<p>')
      expect(result).toContain('Hello world')
    })

    it('converts headings', () => {
      expect(markdownToHtml('## Title')).toContain('<h2>Title</h2>')
      expect(markdownToHtml('### Section')).toContain('<h3>Section</h3>')
    })

    it('converts bold text', () => {
      expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>')
    })

    it('converts italic text', () => {
      expect(markdownToHtml('*italic*')).toContain('<em>italic</em>')
    })

    it('converts unordered lists', () => {
      const md = '- item one\n- item two'
      const html = markdownToHtml(md)
      expect(html).toContain('<ul>')
      expect(html).toContain('<li>item one</li>')
      expect(html).toContain('<li>item two</li>')
    })

    it('converts ordered lists', () => {
      const md = '1. first\n2. second'
      const html = markdownToHtml(md)
      expect(html).toContain('<ol>')
      expect(html).toContain('<li>first</li>')
      expect(html).toContain('<li>second</li>')
    })

    it('converts blockquotes', () => {
      const md = '> quoted text'
      const html = markdownToHtml(md)
      expect(html).toContain('<blockquote>')
      expect(html).toContain('quoted text')
    })

    it('converts strikethrough', () => {
      expect(markdownToHtml('~~deleted~~')).toContain('<s>deleted</s>')
    })

    it('handles multiple paragraphs', () => {
      const md = 'First paragraph\n\nSecond paragraph'
      const html = markdownToHtml(md)
      expect(html).toContain('<p>First paragraph</p>')
      expect(html).toContain('<p>Second paragraph</p>')
    })

    it('handles template section format', () => {
      const md = '### Best Moment\nSomething great\n\n### What I Learned\nA lesson'
      const html = markdownToHtml(md)
      expect(html).toContain('<h3>Best Moment</h3>')
      expect(html).toContain('Something great')
      expect(html).toContain('<h3>What I Learned</h3>')
      expect(html).toContain('A lesson')
    })
  })

  describe('htmlToMarkdown', () => {
    it('returns empty string for empty HTML', () => {
      expect(htmlToMarkdown('')).toBe('')
      expect(htmlToMarkdown('<p></p>')).toBe('')
    })

    it('converts paragraphs to plain text', () => {
      expect(htmlToMarkdown('<p>Hello</p>')).toBe('Hello')
    })

    it('converts headings', () => {
      expect(htmlToMarkdown('<h2>Title</h2>')).toContain('## Title')
      expect(htmlToMarkdown('<h3>Sub</h3>')).toContain('### Sub')
    })

    it('converts bold', () => {
      expect(htmlToMarkdown('<strong>bold</strong>')).toContain('**bold**')
    })

    it('converts italic', () => {
      expect(htmlToMarkdown('<em>italic</em>')).toContain('*italic*')
    })

    it('converts unordered lists', () => {
      const html = '<ul><li>one</li><li>two</li></ul>'
      const md = htmlToMarkdown(html)
      expect(md).toContain('- one')
      expect(md).toContain('- two')
    })

    it('converts ordered lists', () => {
      const html = '<ol><li>first</li><li>second</li></ol>'
      const md = htmlToMarkdown(html)
      expect(md).toContain('1. first')
      expect(md).toContain('2. second')
    })

    it('converts blockquotes', () => {
      const html = '<blockquote><p>quoted</p></blockquote>'
      const md = htmlToMarkdown(html)
      expect(md).toContain('> quoted')
    })

    it('converts strikethrough', () => {
      expect(htmlToMarkdown('<s>deleted</s>')).toContain('~~deleted~~')
    })

    it('decodes HTML entities', () => {
      expect(htmlToMarkdown('<p>&amp; &lt; &gt;</p>')).toBe('& < >')
    })
  })

  describe('roundtrip fidelity', () => {
    const cases = [
      'Simple plain text',
      '## Heading Two',
      '### Heading Three',
      '**bold text**',
      '*italic text*',
      '- bullet one\n- bullet two',
      '1. numbered one\n2. numbered two',
      '> a quote',
      '~~strikethrough~~',
    ]

    cases.forEach((md) => {
      it(`roundtrips: "${md.substring(0, 30)}..."`, () => {
        const html = markdownToHtml(md)
        const result = htmlToMarkdown(html)
        // Roundtrip should preserve the essential content
        const normalizedInput = md.replace(/\s+/g, ' ').trim()
        const normalizedResult = result.replace(/\s+/g, ' ').trim()
        expect(normalizedResult).toBe(normalizedInput)
      })
    })

    it('preserves template section format', () => {
      const template = '### Best Moment\nSomething great\n\n### What I Learned\nA lesson'
      const html = markdownToHtml(template)
      const result = htmlToMarkdown(html)
      expect(result).toContain('### Best Moment')
      expect(result).toContain('Something great')
      expect(result).toContain('### What I Learned')
      expect(result).toContain('A lesson')
    })
  })
})
