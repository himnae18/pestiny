import { CalendarDays, House, MoreHorizontal } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '홈', icon: House },
  { to: '/calendar', label: '달력', icon: CalendarDays },
  { to: '/more', label: '더보기', icon: MoreHorizontal },
]

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FORTUNE DRAW</p>
          <h1>운명 한 장</h1>
        </div>
        <div className="topbar-star">✦</div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="주요 메뉴">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon size={21} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
