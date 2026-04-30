import { useApp } from '../context/AppContext'
import base from '../../ui_translations.json'
import statsKeys from '../../ui_translations_stats.json'
import gamesKeys from '../../ui_translations_games.json'

export const translations = { ...base, ...statsKeys, ...gamesKeys }

export function useTranslation() {
  const { uiLanguage, setUiLanguage } = useApp()
  const lang = uiLanguage || 'en'
  const t = (key) => translations[key]?.[lang] ?? translations[key]?.['en'] ?? key
  return { t, lang, setLang: setUiLanguage }
}
