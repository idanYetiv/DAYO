import DOMPurify from 'dompurify'

// Allow only safe HTML tags that TipTap produces
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's',
  'h1', 'h2', 'h3',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'hr', 'span',
]

const ALLOWED_ATTR = ['class', 'style']

/**
 * Sanitize HTML content before saving to the database.
 * Strips all dangerous tags/attributes while preserving
 * the safe subset that TipTap's editor produces.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}
