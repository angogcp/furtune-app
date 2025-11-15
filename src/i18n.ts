import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import ja from './locales/ja/common.json'

const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
const defaultLang = saved || (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ja') ? 'ja' : 'en')

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: defaultLang || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18next
