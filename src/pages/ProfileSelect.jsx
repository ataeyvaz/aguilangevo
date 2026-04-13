import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_PROFILES = [
  {
    id: 'kartal',
    name: 'Kartal',
    initial: 'K',
    streak: 5,
    points: 240,
    level: 3,
    color: '#0891B2',
    bg: '#EFF8FF',
    type: 'child',
  },
  {
    id: 'emir',
    name: 'Emir',
    initial: 'E',
    streak: 2,
    points: 120,
    level: 1,
    color: '#F59E0B',
    bg: '#FFFBEB',
    type: 'child',
  },
]

const COLORS = [
  { color: '#0891B2', bg: '#EFF8FF' },
  { color: '#F59E0B', bg: '#FFFBEB' },
  { color: '#10B981', bg: '#F0FDF4' },
  { color: '#8B5CF6', bg: '#F5F3FF' },
  { color: '#EF4444', bg: '#FEF2F2' },
  { color: '#EC4899', bg: '#FDF2F8' },
]

export default function ProfileSelect() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('child')
  const [newColor, setNewColor] = useState(0)

  const saved = localStorage.getItem('aguilang_profiles')
  const [profiles, setProfiles] = useState(
    saved ? JSON.parse(saved) : DEFAULT_PROFILES
  )

  const handleSelect = (profile) => {
    localStorage.setItem('aguilang_active_profile', JSON.stringify(profile))
    navigate('/language')
  }

  const handleAdd = () => {
    if (!newName.trim()) return
    const chosen = COLORS[newColor]
    const profile = {
      id: Date.now().toString(),
      name: newName.trim(),
      initial: newName.trim()[0].toUpperCase(),
      streak: 0,
      points: 0,
      level: 1,
      color: chosen.color,
      bg: chosen.bg,
      type: newType,
    }
    const updated = [...profiles, profile]
    setProfiles(updated)
    localStorage.setItem('aguilang_profiles', JSON.stringify(updated))
    setShowModal(false)
    setNewName('')
    setNewType('child')
    setNewColor(0)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>🦅</div>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '28px', fontWeight: '800', color: '#0F172A',
          margin: '0 0 6px',
        }}>AguiLang</h1>
        <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
          Kim öğreniyor?
        </p>
      </div>

      {/* Profil listesi */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile)}
            style={{
              width: '100%', background: 'white',
              border: '1px solid #E2E8F0', borderRadius: '14px',
              padding: '16px 20px', display: 'flex', alignItems: 'center',
              gap: '16px', cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = profile.color
              e.currentTarget.style.boxShadow = `0 4px 12px ${profile.color}22`
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: profile.bg, border: `2px solid ${profile.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '20px', fontWeight: '700', color: profile.color, flexShrink: 0,
            }}>
              {profile.initial}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '4px',
              }}>
                {profile.name}
                <span style={{
                  marginLeft: '8px', fontSize: '11px', fontWeight: '600',
                  color: profile.type === 'child' ? '#0891B2' : '#8B5CF6',
                  background: profile.type === 'child' ? '#EFF8FF' : '#F5F3FF',
                  borderRadius: '6px', padding: '2px 8px',
                }}>
                  {profile.type === 'child' ? '👧 Çocuk' : '👤 Yetişkin'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', gap: '12px' }}>
                <span>🔥 {profile.streak} gün</span>
                <span>⭐ {profile.points} puan</span>
                <span>Seviye {profile.level}</span>
              </div>
            </div>
            <div style={{ color: '#CBD5E1', fontSize: '18px' }}>›</div>
          </button>
        ))}

        {/* Yeni profil butonu */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: '100%', background: 'transparent',
            border: '1.5px dashed #CBD5E1', borderRadius: '14px',
            padding: '16px 20px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', cursor: 'pointer',
            color: '#94A3B8', fontSize: '14px', fontWeight: '500',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#0891B2'
            e.currentTarget.style.color = '#0891B2'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#CBD5E1'
            e.currentTarget.style.color = '#94A3B8'
          }}
        >
          + Yeni Profil Ekle
        </button>
      </div>

      {/* Ebeveyn linki */}
      <div style={{ marginTop: '32px' }}>
        <button
          onClick={() => navigate('/parent')}
          style={{
            background: 'none', border: 'none', color: '#94A3B8',
            fontSize: '13px', cursor: 'pointer',
          }}
        >
          🔒 Ebeveyn Paneli
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '24px',
        }}>
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '28px', width: '100%', maxWidth: '380px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '20px', fontWeight: '800', color: '#0F172A',
              marginBottom: '20px',
            }}>
              Yeni Profil Ekle
            </h2>

            {/* İsim */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '700', color: '#64748B',
                letterSpacing: '0.5px', textTransform: 'uppercase',
                display: 'block', marginBottom: '6px',
              }}>
                İsim
              </label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Profil adı..."
                autoFocus
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid #E2E8F0', borderRadius: '10px',
                  fontSize: '15px', outline: 'none',
                  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Tür */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '700', color: '#64748B',
                letterSpacing: '0.5px', textTransform: 'uppercase',
                display: 'block', marginBottom: '8px',
              }}>
                Profil Türü
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { value: 'child', label: '👧 Çocuk' },
                  { value: 'adult', label: '👤 Yetişkin' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setNewType(opt.value)}
                    style={{
                      flex: 1, padding: '10px',
                      background: newType === opt.value ? '#EFF8FF' : 'white',
                      border: `2px solid ${newType === opt.value ? '#0891B2' : '#E2E8F0'}`,
                      borderRadius: '10px', cursor: 'pointer',
                      fontSize: '14px', fontWeight: '600',
                      color: newType === opt.value ? '#0891B2' : '#64748B',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Renk */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '700', color: '#64748B',
                letterSpacing: '0.5px', textTransform: 'uppercase',
                display: 'block', marginBottom: '8px',
              }}>
                Renk
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setNewColor(i)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: c.color, border: newColor === i
                        ? `3px solid #0F172A` : '3px solid transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Önizleme */}
            {newName && (
              <div style={{
                background: '#F8FAFC', borderRadius: '12px',
                padding: '12px 16px', display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '20px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: COLORS[newColor].bg,
                  border: `2px solid ${COLORS[newColor].color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '18px', fontWeight: '700', color: COLORS[newColor].color,
                }}>
                  {newName[0].toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '15px', fontWeight: '700', color: '#0F172A',
                  }}>{newName}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {newType === 'child' ? '👧 Çocuk' : '👤 Yetişkin'} · Seviye 1
                  </div>
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowModal(false); setNewName('') }}
                style={{
                  flex: 1, padding: '12px', background: 'white',
                  border: '1.5px solid #E2E8F0', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600', color: '#64748B', cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                style={{
                  flex: 1, padding: '12px', background: '#0891B2',
                  border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600', color: 'white',
                  cursor: 'pointer', opacity: newName.trim() ? 1 : 0.5,
                }}
              >
                Ekle ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}