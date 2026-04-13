import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuizScreen() {
  const navigate = useNavigate()
  const [words, setWords] = useState([])
  const [phase, setPhase] = useState(1)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answer, setAnswer] = useState('')
  const [sentence, setSentence] = useState([])
  const [bank, setBank] = useState([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const category = JSON.parse(localStorage.getItem('aguilang_active_category') || '{}')
  const lang = JSON.parse(localStorage.getItem('aguilang_active_lang') || '{ "id": "en" }')

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  const buildPhase = useCallback((p, w) => {
    const pool = shuffle(w).slice(0, 5)
    if (p === 1) {
      setQuestions(pool.map(word => {
        const wrong = shuffle(w.filter(x => x.id !== word.id)).slice(0, 3)
        return { word, options: shuffle([word, ...wrong]), type: 'choice' }
      }))
    } else if (p === 2) {
      setQuestions(pool.map(word => ({ word, type: 'fill' })))
    } else if (p === 3) {
      const sentences = [
        { tr: 'Büyük bir köpek var.', words: ['a', 'big', 'dog', 'there', 'is'] },
        { tr: 'Kedi küçük ve sevimli.', words: ['small', 'the', 'cat', 'is', 'cute', 'and'] },
        { tr: 'Elma kırmızıdır.', words: ['is', 'apple', 'red', 'the'] },
        { tr: 'Aileyi seviyorum.', words: ['love', 'I', 'my', 'family'] },
        { tr: 'Okula gidiyorum.', words: ['to', 'I', 'go', 'school'] },
      ]
      setQuestions(shuffle(sentences).slice(0, 3).map(s => ({
        ...s, type: 'sentence'
      })))
    }
    setCurrent(0)
    setSelected(null)
    setAnswer('')
    setSentence([])
    setBank([])
    setIsCorrect(null)
  }, [])

  useEffect(() => {
    const loadWords = async () => {
      try {
        const module = await import(`../data/${category.id}-a1.json`)
        const data = module.default
        const langData = data.translations?.[lang.id]
        if (langData?.words) {
          setWords(langData.words)
          buildPhase(1, langData.words)
        }
      } catch {
        setWords([])
      }
    }
    if (category.id) loadWords()
  }, [category.id, lang.id, buildPhase])

  const q = questions[current]

  useEffect(() => {
    if (q?.type === 'sentence' && q?.words) {
      setBank(shuffle(q.words))
      setSentence([])
    }
  }, [current, phase, q?.type, q?.words])

  const checkAnswer = () => {
    if (!q) return
    let correct = false
    if (q.type === 'choice') {
      correct = selected?.id === q.word.id
    } else if (q.type === 'fill') {
      correct = answer.trim().toLowerCase() === q.word.word.toLowerCase()
    } else if (q.type === 'sentence') {
      const correctSorted = [...q.words].sort().join(',')
      const userSorted = [...sentence].sort().join(',')
      correct = correctSorted === userSorted
    }
    setIsCorrect(correct)
    if (correct) setScore(s => s + 10)
    setTimeout(() => {
      setIsCorrect(null)
      if (current < questions.length - 1) {
        setCurrent(c => c + 1)
        setSelected(null)
        setAnswer('')
      } else {
        if (phase < 3) {
          const nextPhase = phase + 1
          setPhase(nextPhase)
          buildPhase(nextPhase, words)
        } else {
          setShowResult(true)
        }
      }
    }, 1000)
  }

  const addToSentence = (word, idx) => {
    setSentence(s => [...s, word])
    setBank(b => b.filter((_, i) => i !== idx))
  }

  const removeFromSentence = (word, idx) => {
    setBank(b => [...b, word])
    setSentence(s => s.filter((_, i) => i !== idx))
  }

  const totalQ = 13
  const doneQ = (phase - 1) * 5 + current
  const progress = Math.round((doneQ / totalQ) * 100)

  const PHASE_LABELS = {
    1: '🎯 Tanıma',
    2: '✏️ Hatırlama',
    3: '🧩 Cümle Kurma',
  }

  if (showResult) return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
        {score >= 100 ? '🏆' : score >= 70 ? '⭐' : '💪'}
      </div>
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '28px',
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: '8px',
      }}>
        {score >= 100 ? 'Mükemmel!' : score >= 70 ? 'Harika!' : 'İyi gidiyorsun!'}
      </h2>
      <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '32px' }}>
        {score} puan kazandın · {category.name} kategorisi
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => { setCurrent(0); setPhase(1); setScore(0); setShowResult(false); buildPhase(1, words) }}
          style={{
            padding: '12px 24px', background: 'white',
            border: '1.5px solid #E2E8F0', borderRadius: '12px',
            fontSize: '15px', fontWeight: '600', color: '#64748B', cursor: 'pointer',
          }}
        >🔄 Tekrar</button>
        <button
          onClick={() => navigate('/categories')}
          style={{
            padding: '12px 24px', background: '#0891B2', border: 'none',
            borderRadius: '12px', fontSize: '15px', fontWeight: '600',
            color: 'white', cursor: 'pointer',
          }}
        >📚 Kategoriler</button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '12px 24px', background: '#10B981', border: 'none',
            borderRadius: '12px', fontSize: '15px', fontWeight: '600',
            color: 'white', cursor: 'pointer',
          }}
        >🏠 Dashboard</button>
      </div>
    </div>
  )

  if (!q) return null

  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFC',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '14px 24px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <button
              onClick={() => navigate('/learn')}
              style={{
                background: '#F1F5F9', border: 'none', borderRadius: '8px',
                width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
              }}
            >←</button>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '15px', fontWeight: '700', color: '#0F172A',
              }}>
                {PHASE_LABELS[phase]}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                {category.emoji} {category.name} · Soru {current + 1}/{questions.length}
              </div>
            </div>
            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              borderRadius: '20px', padding: '4px 12px',
              fontSize: '13px', fontWeight: '700', color: '#15803D',
            }}>
              ⭐ {score}
            </div>
          </div>
          <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: '#0891B2', borderRadius: '3px', transition: 'width 0.4s',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {[1, 2, 3].map(p => (
              <div key={p} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: p <= phase ? '#0891B2' : '#E2E8F0',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Soru */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '32px 24px',
        maxWidth: '560px', width: '100%', margin: '0 auto',
      }}>

        {/* AŞAMA 1 */}
        {q.type === 'choice' && (
          <>
            <div style={{ fontSize: '72px', marginBottom: '12px' }}>{q.word.emoji}</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '28px', fontWeight: '800', color: '#0F172A',
              marginBottom: '8px', textAlign: 'center',
            }}>{q.word.word}</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>
              Türkçe karşılığı hangisi?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
              {q.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => !isCorrect && setSelected(opt)}
                  style={{
                    padding: '16px',
                    background: selected?.id === opt.id
                      ? isCorrect === true ? '#F0FDF4' : isCorrect === false ? '#FEF2F2' : '#EFF8FF'
                      : 'white',
                    border: `2px solid ${selected?.id === opt.id
                      ? isCorrect === true ? '#10B981' : isCorrect === false ? '#EF4444' : '#0891B2'
                      : '#E2E8F0'}`,
                    borderRadius: '12px', cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '16px', fontWeight: '600', color: '#0F172A',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.tr}
                </button>
              ))}
            </div>
          </>
        )}

        {/* AŞAMA 2 */}
        {q.type === 'fill' && (
          <>
            <div style={{ fontSize: '72px', marginBottom: '12px' }}>{q.word.emoji}</div>
            <p style={{ fontSize: '20px', color: '#64748B', marginBottom: '8px', textAlign: 'center' }}>
              <strong style={{ color: '#0F172A' }}>{q.word.tr}</strong> kelimesini yaz
            </p>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>/{q.word.pron}/</p>
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && answer && checkAnswer()}
              placeholder="Cevabını yaz..."
              style={{
                width: '100%', padding: '16px', fontSize: '20px', textAlign: 'center',
                border: `2px solid ${isCorrect === true ? '#10B981' : isCorrect === false ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '12px', outline: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: '600',
                background: isCorrect === true ? '#F0FDF4' : isCorrect === false ? '#FEF2F2' : 'white',
                boxSizing: 'border-box',
              }}
            />
          </>
        )}

        {/* AŞAMA 3 */}
        {q.type === 'sentence' && (
          <>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px', textAlign: 'center' }}>
              Bu cümleyi İngilizce kur:
            </p>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '22px', fontWeight: '700', color: '#0F172A',
              marginBottom: '24px', textAlign: 'center',
            }}>
              "{q.tr}"
            </h3>
            <div style={{
              width: '100%', minHeight: '60px', background: 'white',
              border: `2px solid ${isCorrect === true ? '#10B981' : isCorrect === false ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '12px', padding: '12px',
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              marginBottom: '16px', alignItems: 'center',
            }}>
              {sentence.length === 0 && (
                <span style={{ color: '#CBD5E1', fontSize: '14px' }}>Aşağıdan kelime seç...</span>
              )}
              {sentence.map((w, i) => (
                <button
                  key={i}
                  onClick={() => removeFromSentence(w, i)}
                  style={{
                    padding: '6px 14px', background: '#EFF8FF',
                    border: '1.5px solid #0891B2', borderRadius: '8px',
                    fontSize: '15px', fontWeight: '600', color: '#0891B2', cursor: 'pointer',
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
              {bank.map((w, i) => (
                <button
                  key={i}
                  onClick={() => addToSentence(w, i)}
                  style={{
                    padding: '8px 16px', background: 'white',
                    border: '1.5px solid #E2E8F0', borderRadius: '8px',
                    fontSize: '15px', fontWeight: '600', color: '#0F172A', cursor: 'pointer',
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Geri bildirim */}
        {isCorrect !== null && (
          <div style={{
            marginTop: '16px', padding: '12px 20px', borderRadius: '10px',
            background: isCorrect ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
            color: isCorrect ? '#15803D' : '#DC2626',
            fontWeight: '700', fontSize: '15px',
          }}>
            {isCorrect ? '✅ Doğru!' : `❌ Doğrusu: ${q.word?.word || q.words?.join(' ')}`}
          </div>
        )}
      </div>

      {/* Kontrol butonu */}
      <div style={{ padding: '16px 24px 32px', maxWidth: '560px', width: '100%', margin: '0 auto' }}>
        <button
          onClick={checkAnswer}
          disabled={
            (q.type === 'choice' && !selected) ||
            (q.type === 'fill' && !answer.trim()) ||
            (q.type === 'sentence' && sentence.length === 0) ||
            isCorrect !== null
          }
          style={{
            width: '100%', height: '52px', background: '#0891B2',
            border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700', color: 'white',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: (
              (q.type === 'choice' && !selected) ||
              (q.type === 'fill' && !answer.trim()) ||
              (q.type === 'sentence' && sentence.length === 0) ||
              isCorrect !== null
            ) ? 0.5 : 1,
          }}
        >
          Kontrol Et ✓
        </button>
      </div>
    </div>
  )
}