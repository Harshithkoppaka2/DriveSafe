import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import Icon from './Icon'
import { initials } from '../utils/format'

const navItems = [
  { to: '/', label: 'Overview', icon: 'dashboard', end: true },
  { to: '/vehicles', label: 'Vehicles', icon: 'car' },
  { to: '/rentals', label: 'Rentals', icon: 'rental' },
  { to: '/maintenance', label: 'Maintenance', icon: 'wrench' },
  { to: '/inspections', label: 'Inspections', icon: 'inspect' }
]

const titles = {
  '/': ['Overview', 'Fleet operations at a glance'],
  '/vehicles': ['Vehicles', 'Manage fleet readiness and mileage'],
  '/rentals': ['Rentals', 'Reservations, active rentals and extensions'],
  '/maintenance': ['Maintenance', 'Preventive service and vehicle readiness'],
  '/inspections': ['Inspections', 'Pickup and return condition records'],
  '/employees': ['Team', 'Agency access and staff accounts']
}

export default function AppShell() {
  const { session, signOut } = useAuth()
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] || ['DriveSafe', 'Rental operations']

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="shield" size={20} /></div>
          <div><div className="brand">DriveSafe</div><div className="brand-subtitle">Fleet operations</div></div>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar">NR</div>
          <div className="workspace-copy">
            <strong>{session?.agencyName || 'Northline Rentals'}</strong>
            <span>Houston · Main location</span>
          </div>
          <Icon name="chevron" size={15} />
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Workspace</span>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          {session?.role === 'ADMIN' && <NavLink to="/employees"><Icon name="users" /><span>Team</span></NavLink>}
        </nav>

        <div className="sidebar-help">
          <div className="help-icon"><Icon name="wrench" size={17} /></div>
          <strong>3 vehicles need attention</strong>
          <span>Review service due dates before the next checkout.</span>
          <NavLink to="/maintenance">View maintenance <Icon name="arrow" size={14} /></NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="user-avatar">{initials(session?.name)}</div>
          <div className="user-meta">
            <strong>{session?.name}</strong>
            <span>{session?.role === 'ADMIN' ? 'Agency admin' : 'Rental agent'}</span>
          </div>
          <button className="icon-button subtle" onClick={signOut} title="Sign out"><Icon name="logout" /></button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="topbar-actions">
            <button className="icon-action" title="Notifications"><Icon name="bell" /><span className="notification-dot" /></button>
            <div className="today-chip"><Icon name="calendar" size={16} />{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </header>
        <main className="page"><Outlet /></main>
      </div>
    </div>
  )
}
