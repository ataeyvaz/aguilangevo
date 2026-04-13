import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/dashboard', label: 'Anasayfa', icon: '🏠' },
  { to: '/learn',     label: 'Öğren',    icon: '📚' },
  { to: '/play',      label: 'Oyna',     icon: '🎮' },
  { to: '/profile',   label: 'Profil',   icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav
      className="md:hidden flex items-center justify-around"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        height: '60px',
        flexShrink: 0,
      }}
    >
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-gray-400',
            ].join(' ')
          }
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
