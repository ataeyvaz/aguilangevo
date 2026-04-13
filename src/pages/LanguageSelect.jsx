import { useNavigate } from 'react-router-dom'

const LANGUAGES = [
  {
    id: 'en',
    code: 'GB',
    name: 'İngilizce',
    native: 'English',
    flag: '/flags/gb.png',
    color: '#1D4ED8',
    bg: '#EFF6FF',
  },
  {
    id: 'de',
    code: 'DE',
    name: 'Almanca',
    native: 'Deutsch',
    flag: '/flags/de.png',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    id: 'es',
    code: 'ES',
    name: 'İspanyolca',
    native: 'Español',
    flag: '/flags/es.png',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    id: 'it',
    code: 'IT',
    name: 'İtalyanca',
    native: 'Italiano',
    flag: '/flags/it.png',
    color: '#16A34A',
    bg: '#F0FDF4',
  },
]

export default function LanguageSelect() {
  const navigate = useNavigate()

  const profile = JSON.parse(
    localStorage.getItem('aguilang_active_profile') || '{}'
  )

  const handleSelect = (lang) => {
    localStorage.setItem('aguilang_active_lang', JSON.stringify(lang))
    navigate('/categories')
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
      {/* Başlık */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>👋</div>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '26px',
          fontWeight: '800',
          color: '#0F172A',
          margin: '0 0 6px',
        }}>
          Merhaba, {profile.name || 'Kahraman'}!
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
          Hangi dili öğrenmek istiyorsun?
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Ana dil — kilitli */}
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#94A3B8',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          paddingLeft: '4px',
        }}>
          Ana Dilin
        </div>
        <div style={{
          width: '100%',
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '700',
            color: '#64748B',
          }}>
            TR
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '16px',
              fontWeight: '700',
              color: '#64748B',
            }}>Türkçe</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Turkce</div>
          </div>
          <div style={{ fontSize: '16px' }}>🔒</div>
        </div>

        {/* Öğrenilecek diller */}
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#94A3B8',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          paddingLeft: '4px',
        }}>
          Öğrenmek İstediğin Dil
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang)}
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
                e.currentTarget.style.borderColor = lang.color
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${lang.color}22`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
              }}
            >
              {/* Bayrak */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: lang.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: lang.color,
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                <img
                  src={lang.flag}
                  alt={lang.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.parentNode.textContent = lang.code
                  }}
                />
              </div>

              {/* Bilgi */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0F172A',
                  marginBottom: '2px',
                }}>
                  {lang.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {lang.native}
                </div>
              </div>

              {/* Ok */}
              <div style={{ color: '#CBD5E1', fontSize: '18px' }}>›</div>
            </button>
          ))}
        </div>
      </div>

      {/* Geri */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '28px',
          background: 'none',
          border: 'none',
          color: '#94A3B8',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        ← Geri dön
      </button>
    </div>
  )
}