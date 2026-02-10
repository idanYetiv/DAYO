import { useTranslation } from 'react-i18next'
import { isRTLLanguage } from '../i18n'

export type Direction = 'ltr' | 'rtl'

export function useDirection() {
  const { i18n } = useTranslation()
  const isRTL = isRTLLanguage(i18n.language)
  const dir: Direction = isRTL ? 'rtl' : 'ltr'

  return { isRTL, dir }
}
