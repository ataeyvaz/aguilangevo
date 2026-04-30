import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const AGE_MODES = [
  { value: 'adult', icon: '👤', label: 'Adult',  sub: '13 and older' },
  { value: 'child', icon: '👦', label: 'Child',  sub: 'Under 13' },
]

const UI_LANGS = [
  { value: 'en', flag: '🇺🇸', label: 'English' },
  { value: 'es', flag: '🇪🇸', label: 'Español' },
  { value: 'pt', flag: '🇧🇷', label: 'Português' },
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { saveProfile } = useApp()

  const [ageMode,  setAgeMode]  = useState('adult')
  const [uiLang,   setUiLang]   = useState('en')

  const handleStart = () => {
    saveProfile({
      name:           'Aguila',
      initial:        'A',
      type:           ageMode,
      ui_language:    uiLang,
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
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">🦅</div>
          <h1 className="text-3xl font-black text-slate-900 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AguiLangEvo
          </h1>
          <p className="text-slate-500 text-sm">Let's get you set up</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">

          {/* Age mode */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Who is learning?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {AGE_MODES.map(({ value, icon, label, sub }) => {
                const active = ageMode === value
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
                    <div className={`text-xs mt-0.5 ${active ? 'text-cyan-100' : 'text-slate-400'}`}>
                      {sub}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* UI language */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              App language
            </p>
            <div className="flex gap-2">
              {UI_LANGS.map(({ value, flag, label }) => {
                const active = uiLang === value
                return (
                  <button
                    key={value}
                    onClick={() => setUiLang(value)}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 text-center transition-all
                      ${active
                        ? 'bg-cyan-600 border-cyan-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300'}`}
                  >
                    <div className="text-xl mb-0.5">{flag}</div>
                    <div className={`text-xs font-bold
                      ${active ? 'text-white' : 'text-slate-600'}`}>
                      {label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800
                     text-white font-black text-lg rounded-2xl transition-colors
                     shadow-lg shadow-cyan-600/30"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Let's Go! 🦅
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          You can change these later in Settings
        </p>
      </div>
    </div>
  )
}
