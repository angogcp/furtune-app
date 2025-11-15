import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const setLang = (lng: 'en' | 'ja') => {
    i18n.changeLanguage(lng)
    if (typeof window !== 'undefined') localStorage.setItem('lang', lng)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded text-sm ${i18n.language === 'en' ? 'bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-purple-700/50'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ja')}
        className={`px-2 py-1 rounded text-sm ${i18n.language === 'ja' ? 'bg-purple-700 text-white' : 'text-purple-200 hover:text-white hover:bg-purple-700/50'}`}
      >
        日本語
      </button>
    </div>
  )
}
