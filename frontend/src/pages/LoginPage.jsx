import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, errorMessage } from '../api/http'
import { useAuth } from '../state/AuthContext'
import Icon from '../components/Icon'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault(); setError('')
    try { const { data } = await authApi.post('/api/auth/login', form); signIn(data); navigate('/') }
    catch (err) { setError(errorMessage(err)) }
  }

  function useDemo() { setForm({ email: 'demo@drivesafe.app', password: 'DriveSafe123!' }) }

  return <div className="auth-layout">
    <aside className="auth-story">
      <div className="auth-brand"><div className="brand-mark"><Icon name="shield" size={21}/></div><span>DriveSafe</span></div>
      <div className="auth-story-copy"><span className="eyebrow light">Rental operations, without the spreadsheet</span><h1>Know which car is ready before you hand over the keys.</h1><p>DriveSafe keeps vehicle readiness, rental conflicts and condition evidence in one lightweight workspace for independent rental agencies.</p></div>
      <div className="auth-proof"><div><Icon name="wrench"/><span><strong>Maintenance gate</strong> blocks overdue vehicles</span></div><div><Icon name="calendar"/><span><strong>Conflict check</strong> protects future reservations</span></div><div><Icon name="camera"/><span><strong>Condition history</strong> keeps before/after evidence</span></div></div>
      <span className="auth-footnote">Built as a focused operations tool—not another car-booking marketplace.</span>
    </aside>
    <main className="auth-form-wrap"><form className="auth-card" onSubmit={submit}>
      <div className="mobile-auth-brand"><div className="brand-mark"><Icon name="shield" size={19}/></div><span>DriveSafe</span></div>
      <div><span className="eyebrow">Welcome back</span><h2>Sign in to your agency</h2><p>Use your admin or employee account.</p></div>
      {error && <div className="alert error">{error}</div>}
      <label>Email address<input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@agency.com" required /></label>
      <label>Password<input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Your password" required /></label>
      <button className="primary auth-submit">Sign in <Icon name="arrow" size={16}/></button>
      <button className="demo-button" type="button" onClick={useDemo}><span>Portfolio demo</span><strong>Use demo account</strong></button>
      <p className="auth-switch">Starting a rental business? <Link to="/register">Create an agency</Link></p>
    </form></main>
  </div>
}
