import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodayStats, getDailyStats } from '../hooks/useDailyStats'

const ALL_CAT_IDS = [
  'animals','colors','numbers','fruits','vegetables','body','family',
  'school','food','greetings','questions','clothing','home','transport',
  'time','jobs','sports','places','adjectives','verbs',
]

const DAILY_GOAL = 10

function getHardWords() {
  try {
    const stats = JSON.parse(localStorage.getItem('aguilang_word_stats') || '{}')
    return Object.entries(stats)
      .filter(([, s]) => s.wrong >= 2 && s.correct <= s.wrong)
      .map(([id, s]) => ({ id, ...s }))
      .sort((a, b) => b.wrong - a.wrong)
      .slice(0, 5)
  } catch {
    return []
  }
}

function getLevel(correct, wrong) {
  if (correct >= 3 && correct > wrong) return 3
  if (correct >= 1 && correct > wrong) return 2
  return 1
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [hardWords, setHardWords] = useState(getHardWords)

  // Modal state
  const [showLearnedModal, setShowLearnedModal] = useState(false)
  const [wordMap, setWordMap]       = useState(null)
  const [loadingWords, setLoadingWords] = useState(false)
  const [modalSearch, setModalSearch]   = useState('')
  const wordMapLoadedRef = useRef(false)

  useEffect(() => {
    const refresh = () => setHardWords(getHardWords())
    window.addEventListener('wordStatsUpdated', refresh)
    return () => window.removeEventListener('wordStatsUpdated', refresh)
  }, [])

  // Kelime detaylarını yükle (modal ilk açıldığında)
  useEffect(() => {
    if (!showLearnedModal || wordMapLoadedRef.current) return
    wordMapLoadedRef.current = true
    setLoadingWords(true)

    const lang = (() => {
      try { return JSON.parse(localStorage.getItem('aguilang_active_lang') || '{"id":"en"}') }
      catch { return { id: 'en' } }
    })()
    const stats = (() => {
      try { return JSON.parse(localStorage.getItem('aguilang_word_stats') || '{}') }
      catch { return {} }
    })()

    Promise.all(ALL_CAT_IDS.map(async catId => {
      try {
        const m = await import(`../data/${catId}-a1.json`)
        return m.default.translations?.[lang.id]?.words ?? []
      } catch { return [] }
    })).then(arrays => {
      const detailMap = {}
      arrays.flat().forEach(w => { detailMap[w.id] = { word: w.word, tr: w.tr, emoji: w.emoji } })
      const enriched = {}
      Object.entries(stats).forEach(([id, s]) => {
        enriched[id] = { ...(detailMap[id] ?? { word: id, tr: '—', emoji: '📝' }), ...s }
      })
      setWordMap(enriched)
      setLoadingWords(false)
    })
  }, [showLearnedModal])

  const profile   = JSON.parse(localStorage.getItem('aguilang_active_profile') || '{}')
  const todayStats = getTodayStats()
  const weekStats  = getDailyStats(7)
  const todayKey   = new Date().toISOString().split('T')[0]
  const maxSeen    = Math.max(...weekStats.map(d => d.seen), 1)
  const goalPct    = Math.min(100, Math.round((todayStats.seen / DAILY_GOAL) * 100))

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'

  const RECENT_CATS = [
    { id: 'animals', name: 'Hayvanlar', emoji: '🐾', bg: '#F0FDF4' },
    { id: 'colors',  name: 'Renkler',  emoji: '🎨', bg: '#FDF4FF' },
    { id: 'numbers', name: 'Sayılar',  emoji: '🔢', bg: '#EFF6FF' },
    { id: 'fruits',  name: 'Meyveler', emoji: '🍎', bg: '#FFF7ED' },
  ]

  const handleCategoryClick = (cat) => {
    localStorage.setItem('aguilang_active_category', JSON.stringify(cat))
    navigate('/learn')
  }

  // Modal kelime grupları
  const modalWords = Object.entries(wordMap || {}).filter(([id, w]) => {
    if (!modalSearch) return true
    const q = modalSearch.toLowerCase()
    return id.toLowerCase().includes(q) || w.tr?.toLowerCase().includes(q) || w.word?.toLowerCase().includes(q)
  })
  const mastered  = modalWords.filter(([, w]) => getLevel(w.correct, w.wrong) === 3)
  const learned   = modalWords.filter(([, w]) => getLevel(w.correct, w.wrong) === 2)
  const needWork  = modalWords.filter(([, w]) => getLevel(w.correct, w.wrong) === 1)

  const WordRow = ({ id, w }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '8px 12px', borderRadius: '8px',
      background: '#F8FAFC', marginBottom: '4px',
    }}>
      <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{w.emoji || '📝'}</span>
      <span style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px', flex: 1 }}>{w.word || id}</span>
      <span style={{ fontSize: '13px', color: '#64748B' }}>{w.tr || '—'}</span>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Öğrendiklerim Modal ─────────────────────────────────── */}
      {showLearnedModal && (
        <div
          onClick={() => setShowLearnedModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px 20px 0 0',
              width: '100%', maxWidth: '640px',
              maxHeight: '82vh',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '17px', fontWeight: '800', color: '#0F172A',
                }}>
                  📚 Öğrendiğim Kelimeler ({Object.keys(wordMap || {}).length})
                </div>
              </div>
              <button
                onClick={() => setShowLearnedModal(false)}
                style={{
                  background: '#F1F5F9', border: 'none', borderRadius: '8px',
                  width: '32px', height: '32px', cursor: 'pointer',
                  fontSize: '16px', color: '#64748B',
                }}
              >✕</button>
            </div>

            {/* Arama */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <input
                type="text"
                placeholder="Kelime ara..."
                value={modalSearch}
                onChange={e => setModalSearch(e.target.value)}
                style={{
                  width: '100%', padding: '9px 14px',
                  border: '1px solid #E2E8F0', borderRadius: '10px',
                  fontSize: '14px', outline: 'none',
                  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* İçerik */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {loadingWords ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px' }}>
                  Kelimeler yükleniyor...
                </div>
              ) : Object.keys(wordMap || {}).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px' }}>
                  Henüz öğrenilen kelime yok.
                </div>
              ) : (
                <>
                  {mastered.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#15803D', marginBottom: '8px' }}>
                        ⭐⭐⭐ Pekiştirildi ({mastered.length})
                      </div>
                      {mastered.map(([id, w]) => <WordRow key={id} id={id} w={w} />)}
                    </div>
                  )}
                  {learned.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0891B2', marginBottom: '8px' }}>
                        ⭐⭐ Öğrenildi ({learned.length})
                      </div>
                      {learned.map(([id, w]) => <WordRow key={id} id={id} w={w} />)}
                    </div>
                  )}
                  {needWork.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#EA580C', marginBottom: '8px' }}>
                        🔄 Tekrar gerekli ({needWork.length})
                      </div>
                      {needWork.map(([id, w]) => <WordRow key={id} id={id} w={w} />)}
                    </div>
                  )}
                  {mastered.length === 0 && learned.length === 0 && needWork.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '14px' }}>
                      Arama sonucu bulunamadı.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Cyan Header ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
        padding: '32px 24px 40px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                {greeting}
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '28px', fontWeight: '800', color: 'white',
              }}>
                {profile.name || 'Kahraman'} 👋
              </div>
            </div>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '20px', fontWeight: '700', color: 'white',
            }}>
              {profile.initial || '?'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔥', value: profile.streak || 0, label: 'Günlük Seri' },
              { icon: '⭐', value: profile.points  || 0, label: 'Puan' },
              { icon: '🏆', value: profile.level   || 1, label: 'Seviye' },
            ].map((stat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '10px 16px',
              }}>
                <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '18px', fontWeight: '800', color: 'white', lineHeight: 1,
                  }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── İçerik ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: '720px', margin: '-16px auto 0', padding: '0 24px 40px' }}>

        {/* Günlük Görev */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#FFF7ED', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
            }}>🎯</div>
            <div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '16px', fontWeight: '700', color: '#0F172A',
              }}>Günlük Görev</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                {DAILY_GOAL} flash kart tamamla
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '12px', color: '#94A3B8', marginBottom: '6px',
          }}>
            <span>İlerleme</span>
            <span>{todayStats.seen} / {DAILY_GOAL}</span>
          </div>
          <div style={{
            height: '8px', background: '#F1F5F9',
            borderRadius: '4px', overflow: 'hidden', marginBottom: '16px',
          }}>
            <div style={{
              height: '100%', width: `${goalPct}%`,
              background: goalPct >= 100 ? '#10B981' : '#F59E0B',
              borderRadius: '4px', transition: 'width 0.5s',
            }} />
          </div>
          <button
            onClick={() => navigate('/categories')}
            style={{
              width: '100%', padding: '13px', background: '#0891B2',
              color: 'white', border: 'none', borderRadius: '12px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}
          >
            {goalPct >= 100 ? '🏆 Hedef Tamamlandı!' : 'Öğrenmeye Devam Et →'}
          </button>
        </div>

        {/* Son 7 gün chart */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '14px',
          }}>
            📈 Son 7 Gün
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '64px' }}>
            {weekStats.map(day => {
              const barH = day.seen > 0 ? Math.max(Math.round((day.seen / maxSeen) * 48), 6) : 3
              const isToday = day.key === todayKey
              return (
                <div
                  key={day.key}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '64px' }}
                >
                  <div style={{
                    width: '100%', height: `${barH}px`,
                    background: isToday ? '#0891B2' : day.seen > 0 ? '#BAE6FD' : '#F1F5F9',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s',
                  }} />
                  <div style={{
                    fontSize: '9px', marginTop: '5px',
                    color: isToday ? '#0891B2' : '#94A3B8',
                    fontWeight: isToday ? '700' : '400',
                  }}>
                    {day.dayName}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
            Bugün: <strong style={{ color: '#0F172A' }}>{todayStats.seen}</strong> kelime ·
            Doğru: <strong style={{ color: '#10B981' }}>{todayStats.correct}</strong> ·
            Yanlış: <strong style={{ color: '#EF4444' }}>{todayStats.wrong}</strong>
          </div>
        </div>

        {/* Zor Kelimeler */}
        {hardWords.length > 0 && (
          <div style={{
            background: 'white', borderRadius: '16px',
            border: '1px solid #FED7AA', padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#FFF7ED', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px',
              }}>⚠️</div>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '16px', fontWeight: '700', color: '#0F172A',
                }}>Zorlanılan Kelimeler</div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>Tekrar pratik yapmanı öneririz</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hardWords.map((word, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#FFF7ED', borderRadius: '10px',
                  padding: '10px 14px', border: '1px solid #FED7AA',
                }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '14px', fontWeight: '700', color: '#9C4600',
                  }}>{word.id}</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '600' }}>❌ {word.wrong} yanlış</span>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>✅ {word.correct} doğru</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/categories')}
              style={{
                width: '100%', marginTop: '12px', padding: '11px',
                background: '#FFF7ED', color: '#9C4600',
                border: '1.5px solid #FED7AA', borderRadius: '10px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              }}
            >
              🔄 Bu Kelimeleri Tekrar Et
            </button>
          </div>
        )}

        {/* Hızlı İstatistik */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            { icon: '⚡', label: 'Bugün Öğrenilen', value: `${todayStats.seen} kelime` },
            { icon: '🏅', label: 'Günlük Hedef',    value: `%${goalPct}` },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '14px',
              border: '1px solid #E2E8F0', padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '20px', fontWeight: '800', color: '#0F172A',
              }}>{item.value}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Öğrendiklerim butonu */}
        <button
          onClick={() => setShowLearnedModal(true)}
          style={{
            width: '100%', padding: '14px', marginBottom: '16px',
            background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '14px',
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#F0FDF4', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', flexShrink: 0,
          }}>📚</div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px', fontWeight: '700', color: '#0F172A',
            }}>Öğrendiklerim</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Tüm kelimelerini gör ve takip et
            </div>
          </div>
          <div style={{ color: '#CBD5E1', fontSize: '18px' }}>›</div>
        </button>

        {/* Kategoriler */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '16px', fontWeight: '700', color: '#0F172A',
            }}>Kategoriler</div>
            <button
              onClick={() => navigate('/categories')}
              style={{
                background: 'none', border: 'none',
                color: '#0891B2', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >Tümünü gör →</button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px',
          }}>
            {RECENT_CATS.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  background: cat.bg, border: '1px solid #E2E8F0',
                  borderRadius: '14px', padding: '16px 12px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '8px', cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '28px' }}>{cat.emoji}</span>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px', fontWeight: '700', color: '#0F172A',
                }}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Maskot */}
        <div style={{
          background: 'white', borderRadius: '14px',
          border: '1px solid #E2E8F0', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px',
        }}>
          <div style={{ fontSize: '36px' }}>🦅</div>
          <div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '2px',
            }}>Devam et!</div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              {hardWords.length > 0
                ? `${hardWords.length} kelimede zorlanıyorsun, tekrar et! 💪`
                : 'Harika gidiyorsun! Bugün de öğren! 🚀'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
