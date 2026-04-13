import { useNavigate } from 'react-router-dom'

const PROFILES = [
  {
    id: 'kartal',
    name: 'Kartal',
    initial: 'K',
    streak: 5,
    points: 240,
    level: 3,
    color: '#0891B2',
    bg: '#EFF8FF',
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
  },
]

export default function ProfileSelect() {
  const navigate = useNavigate()

  const handleSelect = (profile) => {
    localStorage.setItem('aguilang_active_profile', JSON.stringify(profile))
    navigate('/language')
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
          fontSize: '28px',
          fontWeight: '800',
          color: '#0F172A',
          margin: '0 0 6px',
        }}>AguiLang</h1>
        <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
          Kim öğreniyor?
        </p>
      </div>

      {/* Profil listesi */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {PROFILES.map(profile => (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile)}
            style={{
              width: '100%',
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0891B2'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8,145,178,0.12)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: profile.bg,
              border: `2px solid ${profile.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              color: profile.color,
              flexShrink: 0,
            }}>
              {profile.initial}
            </div>

            {/* Bilgi */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '16px',
                fontWeight: '700',
                color: '#0F172A',
                marginBottom: '4px',
              }}>
                {profile.name}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#64748B',
                display: 'flex',
                gap: '12px',
              }}>
                <span>🔥 {profile.streak} gün</span>
                <span>⭐ {profile.points} puan</span>
                <span>Seviye {profile.level}</span>
              </div>
            </div>

            {/* Ok */}
            <div style={{ color: '#CBD5E1', fontSize: '18px' }}>›</div>
          </button>
        ))}

        {/* Yeni profil */}
        <button style={{
          width: '100%',
          background: 'transparent',
          border: '1.5px dashed #CBD5E1',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#94A3B8',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          + Yeni Profil Ekle
        </button>
      </div>

      {/* Ebeveyn linki */}
      <div style={{ marginTop: '32px' }}>
        <button
          onClick={() => navigate('/parent')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          🔒 Ebeveyn Paneli
        </button>
      </div>
    </div>
  )
}