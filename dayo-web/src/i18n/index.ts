import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// English translations
import enCommon from './locales/en/common.json'
import enMoods from './locales/en/moods.json'
import enPrompts from './locales/en/prompts.json'
import enSettings from './locales/en/settings.json'
import enAuth from './locales/en/auth.json'

// Hebrew translations
import heCommon from './locales/he/common.json'
import heMoods from './locales/he/moods.json'
import hePrompts from './locales/he/prompts.json'
import heSettings from './locales/he/settings.json'
import heAuth from './locales/he/auth.json'

export const supportedLanguages = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'he', label: 'Hebrew', nativeLabel: 'עברית', dir: 'rtl' },
] as const

export type LanguageCode = typeof supportedLanguages[number]['code']

export const rtlLanguages: LanguageCode[] = ['he']

export function isRTLLanguage(lang: string): boolean {
  return rtlLanguages.includes(lang as LanguageCode)
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        moods: enMoods,
        prompts: enPrompts,
        settings: enSettings,
        auth: enAuth,
      },
      he: {
        common: heCommon,
        moods: heMoods,
        prompts: hePrompts,
        settings: heSettings,
        auth: heAuth,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'moods', 'prompts', 'settings', 'auth'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
