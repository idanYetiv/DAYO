/**
 * Markdown <-> HTML converter for TipTap editor
 * Bridges TipTap's HTML output with markdown diary_text storage
 */

// --- HTML to Markdown ---

export function htmlToMarkdown(html: string): string {
  if (!html || html === '<p></p>') return ''

  let md = html

  // Headings
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')

  // Bold / Italic / Underline / Strikethrough
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
  md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>') // preserve underline as HTML
  md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
  md = md.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~')

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const inner = content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1').trim()
    return inner.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n'
  })

  // Lists — ordered
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let idx = 0
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m: string, li: string) => {
      idx++
      const text = li.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1').trim()
      return `${idx}. ${text}\n`
    }) + '\n'
  })

  // Lists — unordered
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m: string, li: string) => {
      const text = li.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1').trim()
      return `- ${text}\n`
    }) + '\n'
  })

  // Paragraphs → newlines
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n')

  // Strip remaining HTML tags (except <u>)
  md = md.replace(/<(?!\/?u(?:\s|>))[^>]+>/g, '')

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&quot;/g, '"')
  md = md.replace(/&#39;/g, "'")
  md = md.replace(/&nbsp;/g, ' ')

  // Clean up excessive newlines
  md = md.replace(/\n{3,}/g, '\n\n')

  return md.trim()
}

// --- Markdown to HTML ---

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '<p></p>'

  // Detect if this is plain text (no markdown formatting)
  const hasMarkdown = /[*_#\->\d+\.\[\]~`<u>]/.test(markdown)
  if (!hasMarkdown) {
    // Plain text: wrap paragraphs in <p> tags
    return markdown
      .split(/\n\n+/)
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }

  let html = markdown

  // Process line by line for block elements
  const lines = html.split('\n')
  const result: string[] = []
  let inUl = false
  let inOl = false
  let inBlockquote = false
  let paragraphBuffer: string[] = []

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      result.push(`<p>${paragraphBuffer.join('<br>')}</p>`)
      paragraphBuffer = []
    }
  }

  const closeLists = () => {
    if (inUl) { result.push('</ul>'); inUl = false }
    if (inOl) { result.push('</ol>'); inOl = false }
  }

  const closeBlockquote = () => {
    if (inBlockquote) { result.push('</blockquote>'); inBlockquote = false }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Empty line
    if (!trimmed) {
      flushParagraph()
      closeLists()
      closeBlockquote()
      continue
    }

    // Headings
    const h2Match = trimmed.match(/^## (.+)$/)
    if (h2Match) {
      flushParagraph(); closeLists(); closeBlockquote()
      result.push(`<h2>${inlineMarkdown(h2Match[1])}</h2>`)
      continue
    }

    const h3Match = trimmed.match(/^### (.+)$/)
    if (h3Match) {
      flushParagraph(); closeLists(); closeBlockquote()
      result.push(`<h3>${inlineMarkdown(h3Match[1])}</h3>`)
      continue
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*+] (.+)$/)
    if (ulMatch) {
      flushParagraph(); closeBlockquote()
      if (inOl) { result.push('</ol>'); inOl = false }
      if (!inUl) { result.push('<ul>'); inUl = true }
      result.push(`<li>${inlineMarkdown(ulMatch[1])}</li>`)
      continue
    }

    // Ordered list
    const olMatch = trimmed.match(/^\d+\. (.+)$/)
    if (olMatch) {
      flushParagraph(); closeBlockquote()
      if (inUl) { result.push('</ul>'); inUl = false }
      if (!inOl) { result.push('<ol>'); inOl = true }
      result.push(`<li>${inlineMarkdown(olMatch[1])}</li>`)
      continue
    }

    // Blockquote
    const bqMatch = trimmed.match(/^> (.*)$/)
    if (bqMatch) {
      flushParagraph(); closeLists()
      if (!inBlockquote) { result.push('<blockquote>'); inBlockquote = true }
      result.push(`<p>${inlineMarkdown(bqMatch[1])}</p>`)
      continue
    }

    // Regular text line
    closeLists()
    closeBlockquote()
    paragraphBuffer.push(inlineMarkdown(trimmed))
  }

  flushParagraph()
  closeLists()
  closeBlockquote()

  return result.join('') || '<p></p>'
}

/** Process inline markdown (bold, italic, underline, strikethrough) */
function inlineMarkdown(text: string): string {
  let result = text

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
  result = result.replace(/_(.+?)_/g, '<em>$1</em>')

  // Strikethrough
  result = result.replace(/~~(.+?)~~/g, '<s>$1</s>')

  return result
}
