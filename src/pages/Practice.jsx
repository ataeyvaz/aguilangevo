/**
 * Practice.jsx — Conversation Practice ekranı
 *
 * URL: /practice?word=run&difficulty=easy
 *
 * Akış: Intro → Exchange(0..N-1) → Özet
 */

import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getPackForWord,
  getExchanges,
  saveConvProgress,
  getConvProgress,
  getAvailableDifficulties,
  getAllPackWords,
} from '../services/conversationService'

// ── Sabitler ─────────────────────────────────────────────────

const DIFF_META = {
  easy:   { label: 'Easy',   emoji: '🟢', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  medium: { label: 'Medium', emoji: '🟡', bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-300'   },
  hard:   { label: 'Hard',   emoji: '🔴', bg: 'bg-red-100',     text: 'text-red-700',     border: 'border-red-300'     },
}

const NEXT_DIFF = { easy: 'medium', medium: 'hard' }

// ── Bileşen ───────────────────────────────────────────────────

export default function Practice() {
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const word        = params.get('word') || ''
  const difficulty  = params.get('difficulty') || 'easy'

  // Pack + exchange verileri (sadece bir kez hesaplanır)
  const pack      = useMemo(() => getPackForWord(word, difficulty), [word, difficulty])
  const exchanges = useMemo(() => getExchanges(pack), [pack])
  const prevProg  = useMemo(() => getConvProgress(word, difficulty), [word, difficulty])
  const available = useMemo(() => getAvailableDifficulties(word), [word])

  const meta   = DIFF_META[difficulty] ?? DIFF_META.easy
  const nextD  = NEXT_DIFF[difficulty]

  // ── State ─────────────────────────────────────────────────
  const [phase,       setPhase]       = useState('intro')    // intro | exchange | summary
  const [exchIdx,     setExchIdx]     = useState(0)
  const [selected,    setSelected]    = useState(null)       // seçilen şık indeksi
  const [answers,     setAnswers]     = useState([])         // { correct, points }
  const [totalPoints, setTotalPoints] = useState(0)

  const exchange   = exchanges[exchIdx] ?? null
  const isAnswered = selected !== null
  const isCorrect  = isAnswered && selected === exchange?.correct

  // ── Seçenek seç ───────────────────────────────────────────
  const handleSelect = (idx) => {
    if (selected !== null) return
    const correct = idx === exchange.correct
    const pts     = correct ? (exchange.points ?? 10) : 0
    setSelected(idx)
    setAnswers(prev => [...prev, { correct, points: pts }])
    setTotalPoints(p => p + pts)
  }

  // ── Sonraki exchange / özet ────────────────────────────────
  const handleNext = () => {
    if (exchIdx + 1 < exchanges.length) {
      setExchIdx(i => i + 1)
      setSelected(null)
    } else {
      setPhase('summary')
    }
  }

  // ── Effect: progress kaydet (summary'e geçerken) ──────────
  // saveConvProgress'i summary render sırasında çağırıyoruz
  // çünkü state güncel olmalı — aşağıda sadece bir kez çağrılır.

  // ── PACK BULUNAMADI ───────────────────────────────────────
  if (!pack) {
    const allWords    = getAllPackWords()
    const suggestions = allWords.slice(0, 12)

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col px-6 pt-12 pb-8"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-sm mx-auto">

          <div className="text-center mb-6">
            <div className="text-5xl mb-3">😅</div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">No pack found</h2>
            <p className="text-slate-400 text-sm">
              No conversation pack for{' '}
              <span className="font-bold text-slate-700">"{word}"</span>
              {' '}({difficulty})
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Available words ({allWords.length} total)
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(w => (
                <button
                  key={w}
                  onClick={() => navigate(`/practice?word=${encodeURIComponent(w)}&difficulty=easy`)}
                  className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-700
                             text-sm font-medium rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  {w}
                </button>
              ))}
              {allWords.length > 12 && (
                <span className="text-xs text-slate-400 self-center">
                  +{allWords.length - 12} more
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white
                       font-black rounded-2xl transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  // ── INTRO ─────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-sm">

          <div className="text-center mb-7">
            <div className="text-5xl mb-3">💬</div>
            <h1 className="text-2xl font-black text-slate-900"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Practice Time!
            </h1>
          </div>

          {/* Pack kartı */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
            <div className="text-center mb-5">
              <div className="text-4xl font-black text-cyan-600 mb-1"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {word}
              </div>
              {pack.context && (
                <p className="text-slate-400 text-sm mt-1">📍 {pack.context}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
              <span className="text-slate-400">{exchanges.length} exchanges</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.text}`}>
                {meta.emoji} {meta.label}
              </span>
            </div>

            {/* Önceki skor varsa göster */}
            {prevProg && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Best score</span>
                <span className="font-bold text-slate-600">{prevProg.bestScore} pts
                  · {prevProg.lastCorrect}/{prevProg.lastTotal} correct</span>
              </div>
            )}
          </div>

          {/* Difficulty seçici */}
          {available.length > 1 && (
            <div className="flex gap-2 mb-4">
              {available.map(d => (
                <button
                  key={d}
                  onClick={() => navigate(`/practice?word=${encodeURIComponent(word)}&difficulty=${d}`, { replace: true })}
                  className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all
                    ${d === difficulty
                      ? `${DIFF_META[d].bg} ${DIFF_META[d].text} ${DIFF_META[d].border}`
                      : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {DIFF_META[d].emoji} {DIFF_META[d].label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setPhase('exchange')}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-black
                       text-lg rounded-2xl shadow-lg shadow-cyan-600/25 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Start 🚀
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 text-slate-400 hover:text-slate-600 text-sm mt-2 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // ── EXCHANGE ──────────────────────────────────────────────
  if (phase === 'exchange') {
    const progressPct = Math.round((exchIdx / exchanges.length) * 100)

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col px-5 pt-6 pb-8"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

          {/* Üst bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              ✕
            </button>
            <span className="text-sm font-semibold text-slate-500">
              {word} · {exchIdx + 1} / {exchanges.length}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
              {meta.emoji} {meta.label}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Bot balonu */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center
                            text-white text-lg shrink-0 shadow-sm">
              🤖
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm
                            px-4 py-3 shadow-sm flex-1">
              <p className="text-slate-800 text-sm leading-relaxed">
                {exchange?.bot}
              </p>
            </div>
          </div>

          {/* Seçenekler */}
          <div className="flex flex-col gap-2 flex-1">
            {exchange?.options?.map((opt, i) => {
              let cls = 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'
              if (isAnswered) {
                if (i === exchange.correct) {
                  cls = 'bg-emerald-50 border-emerald-400 text-emerald-800'
                } else if (i === selected) {
                  cls = 'bg-red-50 border-red-400 text-red-800'
                } else {
                  cls = 'bg-white border-slate-100 text-slate-300'
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                               text-left transition-all ${cls}
                               ${!isAnswered ? 'active:scale-[0.98]' : ''}`}
                >
                  <span className="text-slate-300 text-xs font-bold mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Geri bildirim + Sonraki */}
          {isAnswered && (
            <div className="mt-4">
              <div className={`rounded-xl px-4 py-3 mb-3 text-sm
                ${isCorrect
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'}`}>
                {isCorrect ? (
                  <span>
                    ✅ <strong>+{exchange.points ?? 10} pts</strong>
                    {exchange.feedback_correct && ` · ${exchange.feedback_correct}`}
                  </span>
                ) : (
                  <span>
                    ❌ {exchange.feedback_wrong}
                  </span>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white
                           font-black text-base rounded-2xl transition-colors
                           shadow-lg shadow-cyan-600/25"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {exchIdx + 1 < exchanges.length ? 'Next →' : 'See Results 🎯'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── SUMMARY ───────────────────────────────────────────────
  // Progress kaydet (render sırasında bir kez çalışması için ref kullan)
  const correct = answers.filter(a => a.correct).length
  const total   = exchanges.length
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0

  // Progress kaydı (Effect yerine, summary'e girince render başında)
  // Not: strict-mode çift render olsa da saveConvProgress idempotent (MAX)
  saveConvProgress(word, difficulty, totalPoints, correct, total)

  const nextDiffAvailable = nextD && available.includes(nextD)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6"
         style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-sm">

        {/* Başlık */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{pct >= 67 ? '🎊' : '💪'}</div>
          <h2 className="text-2xl font-black text-slate-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {pct >= 67 ? 'Great job!' : 'Keep practicing!'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">"{word}" · {meta.label}</p>
        </div>

        {/* Skor kartı */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center mb-5">
            <div>
              <div className="text-3xl font-black text-slate-900"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {total}
              </div>
              <div className="text-xs text-slate-400 mt-1">Total</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-600"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {correct}
              </div>
              <div className="text-xs text-slate-400 mt-1">Correct ✅</div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-600"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {totalPoints}
              </div>
              <div className="text-xs text-slate-400 mt-1">Points 🏆</div>
            </div>
          </div>

          {/* Pct bar */}
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: pct >= 67 ? '#10B981' : '#F59E0B',
              }}
            />
          </div>
          <div className="text-right text-xs text-slate-400">{pct}% correct</div>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col gap-2">
          {/* Sonraki zorluk (pct >= 67 ise öner) */}
          {nextDiffAvailable && pct >= 67 && (
            <button
              onClick={() => navigate(`/practice?word=${encodeURIComponent(word)}&difficulty=${nextD}`)}
              className={`w-full py-4 text-white font-black text-base rounded-2xl
                          transition-colors shadow-lg
                          ${nextD === 'medium'
                            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                            : 'bg-red-500 hover:bg-red-600 shadow-red-500/25'}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {DIFF_META[nextD].emoji} Try {DIFF_META[nextD].label} →
            </button>
          )}

          {/* Tekrar dene */}
          <button
            onClick={() => {
              setPhase('intro')
              setExchIdx(0)
              setSelected(null)
              setAnswers([])
              setTotalPoints(0)
            }}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700
                       font-bold text-sm rounded-2xl transition-colors"
          >
            🔄 Try Again
          </button>

          <button
            onClick={() => navigate('/study')}
            className="w-full py-4 bg-slate-900 hover:bg-slate-700 text-white
                       font-black text-base rounded-2xl transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Back to Study
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2 text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
