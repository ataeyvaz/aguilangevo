
import { useApp } from '../context/AppContext'
import base from '../../ui_translations.json'
import statsKeys from '../../ui_translations_stats.json'
import gamesKeys from '../../ui_translations_games.json'
import profileKeys from '../../ui_translations_profile.json'
import practiceKeys from '../../ui_translations_practice.json'
import pronunciationKeys from '../../ui_translations_pronunciation.json'

export const translations = { ...base, ...statsKeys, ...gamesKeys, ...profileKeys, ...practiceKeys, ...pronunciationKeys }

// Toplam anahtar sayısı: ~226 unique key (65 base + 39 stats + 58 games + 40 profile + 24 pronunciation)
if (import.meta.env.DEV) {
  console.info('[i18n] Loaded keys:', Object.keys(translations).length)
}

export function useTranslation() {
  const { uiLanguage, setUiLanguage } = useApp()
  const lang = uiLanguage || 'en'
  const t = (key) => translations[key]?.[lang] ?? translations[key]?.['en'] ?? key
  return { t, lang, setLang: setUiLanguage }
}
