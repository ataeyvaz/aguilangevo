import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getTodayStats, getDailyStats } from '../hooks/useDailyStats'
import { useTranslation } from '../i18n/translations'

const DAILY_GOAL = 10

// SRS istatistikleri — browser context (localStorage)
// TODO (Electron/Capacitor): getProgressStats(profileId, pairId) from srsEngine.js
function getSRSStats() {
  try {
    return JSON.parse(localStorage.getItem('aguilang_srs_stats') || 'null') ||
           { new: 130, learning: 0, review: 0, mastered: 0, todayDue: 0 }
  } catch {
    return { new: 130, learning: 0, review: 0, mastered: 0, todayDue: 0 }
  }
}

function getHardWords() {
  try {
    const stats = JSON.parse(localStorage.getItem('aguilang_word_stats') || '{}')
    return Object.entries(stats)
      .filter(([, s]) => s.wrong >= 2 && s.correct <= s.wrong)
      .map(([id, s]) => ({ id, ...s }))
      .sort((a, b) => b.wrong - a.wrong)
      .slice(0, 5)
  } catch { return [] }
}

const QUICK_CATS = [
  { id: 'verbs',   name: 'Verbs',   emoji: '⚡', bg: '#EFF6FF' },
  { id: 'food',    name: 'Food',    emoji: '🍎', bg: '#FFF7ED' },
  { id: 'travel',  name: 'Travel',  emoji: '✈️', bg: '#F0FDF4' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', bg: '#FDF4FF' },
]

const LEVEL_COLORS = {
  A1: { bg: 'rgba(255,255,255,0.2)', text: 'white' },
  A2: { bg: 'rgba(139,92,246,0.3)',  text: 'white' },
}

export default function Dashboard() {
  const navigate    = useNavigate()
  const { profile } = useApp()
  const { t } = useTranslation()

  const [hardWords, setHardWords] = useState(getHardWords)
  const [srsStats]                = useState(getSRSStats)

  useEffect(() => {
    const refresh = () => setHardWords(getHardWords())
    window.addEventListener('wordStatsUpdated', refresh)
    return () => window.removeEventListener('wordStatsUpdated', refresh)
  }, [])

  const todayStats = getTodayStats()
  const weekStats  = getDailyStats(7)
  const todayKey   = new Date().toISOString().split('T')[0]
  const maxSeen    = Math.max(...weekStats.map(d => d.seen), 1)
  const goalPct    = Math.min(100, Math.round((todayStats.seen / DAILY_GOAL) * 100))

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const level = profile?.current_level
  const lc    = LEVEL_COLORS[level] ?? LEVEL_COLORS.A1

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
        padding: '32px 24px 40px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Name + avatar row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                {greeting}
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '28px', fontWeight: '800', color: 'white',
              }}>
                {profile?.name || 'Aguila'} 👋
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              {/* Avatar */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '20px', fontWeight: '700', color: 'white',
              }}>
                {profile?.initial || '🦅'}
              </div>
              {/* Level badge */}
              {level && (
                <div style={{
                  background: lc.bg, borderRadius: '20px',
                  padding: '2px 10px', fontSize: '12px',
                  fontWeight: '800', color: lc.text,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: '1px solid rgba(255,255,255,0.3)',
                }}>
                  {level}
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔥', value: profile?.streak || 0, label: 'Streak' },
              { icon: '⭐', value: profile?.points  || 0, label: 'Points' },
              { icon: '🏆', value: profile?.level   || 1, label: 'Level'  },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '10px 16px',
              }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '18px', fontWeight: '800', color: 'white', lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div style={{ maxWidth: '720px', margin: '-16px auto 0', padding: '0 24px 80px' }}>

        {/* SRS Stats card */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '14px',
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px', fontWeight: '700', color: '#0F172A',
            }}>
              🗂️ Vocabulary Progress
            </div>
            {srsStats.todayDue > 0 && (
              <div style={{
                background: '#FEF2F2', color: '#DC2626',
                borderRadius: '20px', padding: '2px 10px',
                fontSize: '11px', fontWeight: '700',
              }}>
                {srsStats.todayDue} due today
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { label: 'New',      value: srsStats.new,      color: '#94A3B8', bg: '#F8FAFC' },
              { label: 'Learning', value: srsStats.learning,  color: '#F59E0B', bg: '#FFFBEB' },
              { label: 'Review',   value: srsStats.review,    color: '#0891B2', bg: '#EFF8FF' },
              { label: 'Mastered', value: srsStats.mastered,  color: '#10B981', bg: '#F0FDF4' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{
                background: bg, borderRadius: '12px',
                padding: '12px 8px', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '22px', fontWeight: '800', color, lineHeight: 1,
                }}>{value}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/study')}
            style={{
              width: '100%', marginTop: '14px', padding: '13px',
              background: '#0891B2', color: 'white',
              border: 'none', borderRadius: '12px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}
          >
            {srsStats.todayDue > 0
              ? `📚 Study Now (${srsStats.todayDue} due) →`
              : '📚 Study Now →'}
          </button>
        </div>

        {/* Daily Goal */}
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
              }}>Daily Goal</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                Complete {DAILY_GOAL} flash cards
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '12px', color: '#94A3B8', marginBottom: '6px',
          }}>
            <span>Progress</span>
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
              width: '100%', padding: '12px', background: 'white',
              color: '#0891B2', border: '1.5px solid #0891B2',
              borderRadius: '12px', cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px', fontWeight: '700',
            }}
          >
            {goalPct >= 100 ? '🏆 Goal Completed!' : 'Continue Learning →'}
          </button>
        </div>

        {/* Last 7 days */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid #E2E8F0', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '14px',
          }}>
            📈 Last 7 Days
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '64px' }}>
            {weekStats.map(day => {
              const barH   = day.seen > 0 ? Math.max(Math.round((day.seen / maxSeen) * 48), 6) : 3
              const isToday = day.key === todayKey
              return (
                <div key={day.key} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end', height: '64px',
                }}>
                  <div style={{
                    width: '100%', height: `${barH}px`,
                    background: isToday ? '#0891B2' : day.seen > 0 ? '#BAE6FD' : '#F1F5F9',
                    borderRadius: '3px 3px 0 0', transition: 'height 0.3s',
                  }} />
                  <div style={{
                    fontSize: '9px', marginTop: '5px',
                    color: isToday ? '#0891B2' : '#94A3B8',
                    fontWeight: isToday ? '700' : '400',
                  }}>
                    {t(day.dayName)}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
            Today: <strong style={{ color: '#0F172A' }}>{todayStats.seen}</strong> words ·
            Correct: <strong style={{ color: '#10B981' }}>{todayStats.correct}</strong> ·
            Wrong: <strong style={{ color: '#EF4444' }}>{todayStats.wrong}</strong>
          </div>
        </div>

        {/* Hard Words */}
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
                }}>Difficult Words</div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Practice these again
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hardWords.map((w, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#FFF7ED', borderRadius: '10px',
                  padding: '10px 14px', border: '1px solid #FED7AA',
                }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '14px', fontWeight: '700', color: '#9C4600',
                  }}>{w.id}</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '600' }}>❌ {w.wrong}</span>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>✅ {w.correct}</span>
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
              🔄 Review These Words
            </button>
          </div>
        )}

        {/* Quick categories */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '16px', fontWeight: '700', color: '#0F172A',
            }}>Categories</div>
            <button
              onClick={() => navigate('/categories')}
              style={{
                background: 'none', border: 'none',
                color: '#0891B2', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >See all →</button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px',
          }}>
            {QUICK_CATS.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  localStorage.setItem('aguilang_active_category', JSON.stringify(cat))
                  navigate('/learn')
                }}
                style={{
                  background: cat.bg, border: '1px solid #E2E8F0',
                  borderRadius: '14px', padding: '16px 12px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '8px', cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
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

        {/* Mascot */}
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
            }}>Keep going!</div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              {hardWords.length > 0
                ? `${hardWords.length} words need review — let's practice! 💪`
                : "Great job! Come back tomorrow to keep your streak! 🚀"}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
