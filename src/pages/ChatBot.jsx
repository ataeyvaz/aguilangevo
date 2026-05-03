import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from '../i18n/translations'
import { checkAnswer, findBestOption, getPronunciationScore } from '../utils/fuzzyMatch'
import {
  getPackForWord,
  getExchanges,
  saveConvProgress,
  getAllPackWords,
} from '../services/conversationService'
import { saveSession } from '../services/conversationService'

const MODE_POINTS = { pick: 10, type: 12, speak: 15 }

function getAudioPath(botMessage, botLanguage) {
  if (!botMessage || !botLanguage) return null
  let hash = 0
  for (let i = 0; i < botMessage.length; i++) {
    const char = botMessage.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const h = Math.abs(hash).toString(16).padStart(8, '0')
  return `/audio/bot/${botLanguage}/${h}.mp3`
}

function getSpeechLang(pair) {
  const [lang1] = (pair || 'es-en').split('-')
  if (lang1 === 'es') return 'es-ES'
  if (lang1 === 'pt') return 'pt-BR'
  return 'en-US'
}

export default function ChatBot() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { t } = useTranslation()
  const word = params.get('word') || ''
  const difficulty = params.get('difficulty') || 'easy'

  const pack = useMemo(() => getPackForWord(word, difficulty), [word, difficulty])
  const exchanges = useMemo(() => getExchanges(pack), [pack])

  const [messages, setMessages] = useState([])
  const [exchIdx, setExchIdx] = useState(0)
  const [phase, setPhase] = useState('intro') // intro | chat | summary
  const [currentMode, setCurrentMode] = useState(null)
  const [answers, setAnswers] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [typeInput, setTypeInput] = useState('')
  const [typeResult, setTypeResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [speechResult, setSpeechResult] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported] = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition))

  const audioRef = useRef(null)
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)

  const exchange = exchanges[exchIdx] ?? null
  const isAnswered = selected !== null || typeResult !== null || speechResult !== null

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Bot mesajını chat'e ekle
  useEffect(() => {
    if (phase !== 'chat' || !exchange) return

    setCurrentMode(null)
    setSelected(null)
    setTypeInput('')
    setTypeResult(null)
    setSpeechResult(null)

    // Bot baloncuğu ekle
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      text: exchange.bot,
      audioPath: getAudioPath(exchange.bot, pack?.bot_language || 'es'),
    }])

    // Ses çal
    const audioPath = getAudioPath(exchange.bot, pack?.bot_language || 'es')
    if (audioPath) {
      setTimeout(() => {
        if (!audioRef.current) audioRef.current = new Audio()
        audioRef.current.src = audioPath
        audioRef.current.play().catch(() => {})
      }, 400)
    }
  }, [phase, exchIdx])

  // Cleanup
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      recognitionRef.current?.abort()
    }
  }, [])

  // Session kaydet
  useEffect(() => {
    if (phase !== 'summary') return
    const _correct = answers.filter(a => a.correct).length
    const _total = exchanges.length
    saveConvProgress(word, difficulty, totalPoints, _correct, _total)
    const pronScores = answers.filter(a => a.pronunciationScore != null).map(a => a.pronunciationScore)
    const avgPron = pronScores.length ? Math.round(pronScores.reduce((a, b) => a + b, 0) / pronScores.length) : 0
    saveSession({
      word, difficulty,
      packId: pack?.id ?? null,
      totalExchanges: _total,
      completedExchanges: answers.length,
      pickScore: answers.filter(a => a.mode === 'pick').reduce((s, a) => s + a.points, 0),
      typeScore: answers.filter(a => a.mode === 'type').reduce((s, a) => s + a.points, 0),
      speakScore: answers.filter(a => a.mode === 'speak').reduce((s, a) => s + a.points, 0),
      avgPronunciation: avgPron,
      answers: answers.map(a => ({ mode: a.mode, correct: a.correct, score: a.points, pronunciationScore: a.pronunciationScore ?? null })),
    })
  }, [phase])

  const addUserMessage = (text, pts, correct) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text,
      points: pts,
      correct,
    }])
  }

  const handleNext = () => {
    if (exchIdx + 1 < exchanges.length) {
      setExchIdx(i => i + 1)
    } else {
      setPhase('summary')
    }
  }

  const handlePick = (idx) => {
    if (selected !== null) return
    const correct = idx === exchange.correct
    const pts = correct ? MODE_POINTS.pick : 0
    setSelected(idx)
    setAnswers(prev => [...prev, { correct, points: pts, mode: 'pick', pronunciationScore: null }])
    setTotalPoints(p => p + pts)
    addUserMessage(exchange.options[idx], pts, correct)
  }

  const handleTypeSubmit = () => {
    if (!typeInput.trim() || typeResult !== null) return
    const correctAnswer = exchange.options[exchange.correct]
    const result = checkAnswer(typeInput, correctAnswer)
    setTypeResult(result)
    const pts = result.match ? MODE_POINTS.type : 0
    setAnswers(prev => [...prev, { correct: result.match, points: pts, mode: 'type', pronunciationScore: null }])
    setTotalPoints(p => p + pts)
    addUserMessage(typeInput, pts, result.match)
  }

  const startListening = () => {
    if (!speechSupported) { setCurrentMode('pick'); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.lang = getSpeechLang(pack?.pair || 'es-en')
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setIsListening(false)
      const result = findBestOption(transcript, exchange.options)
      const expectedAnswer = exchange.options[exchange.correct]
      const pronunciationResult = getPronunciationScore(transcript, expectedAnswer)
      const correct = result.found ? result.index === exchange.correct : false
      const pts = correct ? MODE_POINTS.speak : 0
      setSpeechResult({ match: correct, transcript, pronunciation: pronunciationResult })
      setAnswers(prev => [...prev, { correct, points: pts, mode: 'speak', pronunciationScore: pronunciationResult?.score ?? null }])
      setTotalPoints(p => p + pts)
      addUserMessage(transcript, pts, correct)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null }
    try { recognition.start() } catch { setIsListening(false) }
  }

  // ── PACK BULUNAMADI ─────────────────────────────────────────────
  if (!pack) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="text-5xl mb-4">😅</div>
        <p className="text-slate-600 mb-6 text-center">No conversation pack for "{word}"</p>
        <button onClick={() => navigate(-1)}
          className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-2xl">
          ← Go Back
        </button>
      </div>
    )
  }

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Chat Practice
            </h2>
            <p className="text-slate-500 text-sm">"{word}" · {difficulty}</p>
            <p className="text-slate-400 text-xs mt-2">{exchanges.length} exchanges</p>
          </div>
          <button
            onClick={() => setPhase('chat')}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-black
                       text-lg rounded-2xl shadow-lg shadow-cyan-600/25 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Start Chat 💬
          </button>
          <button onClick={() => navigate(-1)}
            className="w-full py-2 text-slate-400 text-sm mt-2">
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // ── SUMMARY ──────────────────────────────────────────────────────
  if (phase === 'summary') {
    const correct = answers.filter(a => a.correct).length
    const total = exchanges.length
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-3">{pct >= 67 ? '🏆' : '💪'}</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {pct >= 67 ? 'Great chat!' : 'Keep practicing!'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">"{word}" · {difficulty}</p>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-black text-slate-900">{total}</div>
                <div className="text-xs text-slate-400 mt-1">Total</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-600">{correct}</div>
                <div className="text-xs text-slate-400 mt-1">Correct ✅</div>
              </div>
              <div>
                <div className="text-3xl font-black text-cyan-600">{totalPoints}</div>
                <div className="text-xs text-slate-400 mt-1">Points 🏆</div>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/study')}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl mb-2">
            Back to Study
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="w-full py-2 text-slate-400 text-sm">
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── CHAT UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col"
         style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">✕</button>
        <div className="text-2xl">🤖</div>
        <div>
          <div className="font-bold text-slate-900 text-sm">Chat Practice</div>
          <div className="text-xs text-slate-400">"{word}" · {exchIdx + 1}/{exchanges.length}</div>
        </div>
        <div className="ml-auto text-sm font-bold text-cyan-600">{totalPoints} pts</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm mr-2 shrink-0 mt-1">
                🤖
              </div>
            )}
            <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm font-medium ${
              msg.type === 'bot'
                ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                : msg.correct === true
                  ? 'bg-emerald-500 text-white rounded-tr-sm'
                  : msg.correct === false
                    ? 'bg-red-400 text-white rounded-tr-sm'
                    : 'bg-cyan-600 text-white rounded-tr-sm'
            }`}>
              {msg.text}
              {msg.points > 0 && (
                <span className="ml-2 text-xs opacity-80">+{msg.points}pts</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      {!isAnswered && (
        <div className="bg-white border-t border-slate-200 px-4 py-4">

          {/* Mod seçimi */}
          {!currentMode && (
            <div className="grid grid-cols-3 gap-2 mb-0">
              {[
                { mode: 'pick',  icon: '👆', label: 'Pick',  pts: '10pts' },
                { mode: 'type',  icon: '⌨️', label: 'Type',  pts: '12pts' },
                { mode: 'speak', icon: '🎤', label: 'Speak', pts: '15pts' },
              ].map(({ mode, icon, label, pts }) => (
                <button
                  key={mode}
                  onClick={() => {
                    if (mode === 'speak' && !speechSupported) { setCurrentMode('pick'); return }
                    setCurrentMode(mode)
                    if (mode === 'speak') setTimeout(startListening, 100)
                  }}
                  className="flex flex-col items-center py-3 bg-slate-50 hover:bg-cyan-50
                             border border-slate-200 hover:border-cyan-300 rounded-xl transition-all"
                >
                  <span className="text-xl mb-1">{icon}</span>
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                  <span className="text-xs text-slate-400">{pts}</span>
                </button>
              ))}
            </div>
          )}

          {/* Pick modu */}
          {currentMode === 'pick' && exchange?.options && (
            <div className="space-y-2">
              {exchange.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  className="w-full py-3 px-4 text-left bg-slate-50 hover:bg-cyan-50
                             border border-slate-200 hover:border-cyan-300
                             rounded-xl text-sm font-medium text-slate-700 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Type modu */}
          {currentMode === 'type' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={typeInput}
                onChange={e => setTypeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTypeSubmit()}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200
                           rounded-xl text-sm focus:outline-none focus:border-cyan-400"
                autoFocus
              />
              <button
                onClick={handleTypeSubmit}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white
                           font-bold rounded-xl transition-colors"
              >
                ✓
              </button>
            </div>
          )}

          {/* Speak modu */}
          {currentMode === 'speak' && (
            <div className="text-center py-2">
              {isListening ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-500">Listening...</span>
                </div>
              ) : (
                <button onClick={startListening}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">
                  🎤 Speak Again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <div className="bg-white border-t border-slate-200 px-4 py-4">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white
                       font-black text-base rounded-2xl transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {exchIdx + 1 < exchanges.length ? 'Next →' : 'See Results 🏆'}
          </button>
        </div>
      )}
    </div>
  )
}
