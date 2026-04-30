import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/translations'

// Kullanıcının anadili → uiLanguage kodu
const SPEAK_LANGS = [
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
]

const AGE_MODES = [
  { value: 'adult', icon: '👤' },
  { value: 'child', icon: '👦' },
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { saveProfile, uiLanguage, setUiLanguage } = useApp()
  const { t } = useTranslation()

  const [ageMode, setAgeMode] = useState('adult')

  // Dil seçilince → AppContext güncellenir → tüm t() anında çevrilir
  const handleLangSelect = (code) => {
    setUiLanguage(code)
  }

  const handleStart = () => {
    saveProfile({
      name:           'Aguila',
      initial:        'A',
      type:           ageMode,
      ui_language:    uiLanguage,
      points:         0,
      level:          1,
      streak:         0,
      placement_done: false,
      current_level:  null,
    })
    navigate('/placement-test')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6"
         style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🦅</div>
          <h1 className="text-3xl font-black text-slate-900 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AguiLangEvo
          </h1>
          <p className="text-slate-500 text-sm">{t('lets get started')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4 flex flex-col gap-6">

          {/* ── I speak ────────────────────────────────────── */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {t('i speak')}
            </p>
            <div className="flex gap-2">
              {SPEAK_LANGS.map(({ code, flag, name }) => {
                const active = uiLanguage === code
                return (
                  <button
                    key={code}
                    onClick={() => handleLangSelect(code)}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-center transition-all
                      ${active
                        ? 'bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-600/25'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300'}`}
                  >
                    <div className="text-2xl mb-0.5">{flag}</div>
                    <div className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-600'}`}>
                      {name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── I want to learn ────────────────────────────── */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {t('i want to learn')}
            </p>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
              <span className="text-2xl">🇬🇧</span>
              <span className="font-bold text-slate-800 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t('english')}
              </span>
              <span className="ml-auto text-cyan-600 text-sm font-bold">✓</span>
            </div>
          </div>

          {/* ── Who is learning ────────────────────────────── */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {t('choose your mode')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {AGE_MODES.map(({ value, icon }) => {
                const active = ageMode === value
                const label  = value === 'adult' ? t('adult mode') : t('child mode')
                return (
                  <button
                    key={value}
                    onClick={() => setAgeMode(value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all
                      ${active
                        ? 'bg-cyan-600 border-cyan-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300'}`}
                  >
                    <div className="text-3xl mb-1">{icon}</div>
                    <div className="font-bold text-sm"
                         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Let's go ────────────────────────────────────── */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800
                     text-white font-black text-lg rounded-2xl transition-colors
                     shadow-lg shadow-cyan-600/30"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {t('lets go')} 🦅
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          {t('change language')} → {t('profile')}
        </p>
      </div>
    </div>
  )
}
