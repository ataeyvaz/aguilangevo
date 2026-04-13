import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/learn',     label: 'Öğren',     icon: '📚' },
  { to: '/play',      label: 'Oyna',      icon: '🎮' },
  { to: '/profile',   label: 'Profil',    icon: '👤' },
]

export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        width: '220px',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6 border-b border-border">
        <span className="text-2xl">🦅</span>
        <span
          className="text-lg font-bold text-text"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          AguiLang
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-background',
              ].join(' ')
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Ebeveyn linki */}
      <div className="px-3 py-4 border-t border-border">
        <NavLink
          to="/parent"
          className={({ isActive }) =>
            [
              'flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-white'
                : 'text-text hover:bg-background',
            ].join(' ')
          }
        >
          <span>🔒</span>
          <span>Ebeveyn</span>
        </NavLink>
      </div>
    </aside>
  )
}
