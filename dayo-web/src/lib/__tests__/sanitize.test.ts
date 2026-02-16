import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../sanitize'

describe('sanitizeHtml', () => {
  it('should return empty string for null/undefined', () => {
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
    expect(sanitizeHtml('')).toBe('')
  })

  it('should preserve safe TipTap HTML tags', () => {
    const html = '<p>Hello <strong>bold</strong> and <em>italic</em></p>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should preserve headings', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should preserve lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should preserve ordered lists', () => {
    const html = '<ol><li>First</li><li>Second</li></ol>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should preserve blockquotes and code', () => {
    const html = '<blockquote>Quote</blockquote><pre><code>code</code></pre>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should preserve underline and strikethrough', () => {
    const html = '<p><u>underline</u> and <s>strike</s></p>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should preserve br and hr', () => {
    const html = '<p>Line 1<br>Line 2</p><hr>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should strip script tags', () => {
    const html = '<p>Safe text</p><script>alert("xss")</script>'
    expect(sanitizeHtml(html)).toBe('<p>Safe text</p>')
  })

  it('should strip iframe tags', () => {
    const html = '<p>Text</p><iframe src="https://evil.com"></iframe>'
    expect(sanitizeHtml(html)).toBe('<p>Text</p>')
  })

  it('should strip event handlers', () => {
    const html = '<p onclick="alert(1)">Click me</p>'
    expect(sanitizeHtml(html)).toBe('<p>Click me</p>')
  })

  it('should strip img tags', () => {
    const html = '<p>Text</p><img src="x" onerror="alert(1)">'
    expect(sanitizeHtml(html)).toBe('<p>Text</p>')
  })

  it('should strip link tags with javascript:', () => {
    const html = '<a href="javascript:alert(1)">Click</a>'
    expect(sanitizeHtml(html)).toBe('Click')
  })

  it('should strip object/embed tags', () => {
    const html = '<object data="evil.swf"></object><embed src="evil.swf">'
    expect(sanitizeHtml(html)).toBe('')
  })

  it('should strip form elements', () => {
    const html = '<form action="/steal"><input type="text"></form>'
    expect(sanitizeHtml(html)).toBe('')
  })

  it('should preserve class and style attributes', () => {
    const html = '<span class="highlight" style="color: red">Text</span>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('should strip event handler attributes', () => {
    const html = '<p onmouseover="alert(1)" onfocus="alert(2)">Text</p>'
    expect(sanitizeHtml(html)).toBe('<p>Text</p>')
  })

  it('should preserve harmless data-* attributes', () => {
    const html = '<p data-id="123">Text</p>'
    expect(sanitizeHtml(html)).toBe('<p data-id="123">Text</p>')
  })
})
