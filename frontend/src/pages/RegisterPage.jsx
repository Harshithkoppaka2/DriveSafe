import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, errorMessage } from '../api/http.js'
import { useAuth } from '../state/AuthContext.jsx'
import Icon from '../components/Icon.jsx'

export default function RegisterPage() {
  const [form, setForm] = useState({ agencyName:'', adminName:'', email:'', password:'' })
  const [error, setError] = useState('')
  const { signIn } = useAuth(); const navigate = useNavigate()
  const set = key => e => setForm({...form, [key]:e.target.value})
  async function submit(e) {
    e.preventDefault(); setError('')
    try { const {data}=await authApi.post('/api/auth/register-agency', form); signIn(data); navigate('/') }
    catch(err){ setError(errorMessage(err)) }
  }
  return <div className="auth-layout">
    <aside className="auth-story register-story"><div className="auth-brand"><div className="brand-mark"><Icon name="shield" size={21}/></div><span>DriveSafe</span></div><div className="auth-story-copy"><span className="eyebrow light">Built for independent fleets</span><h1>Set up your operation in minutes.</h1><p>Add the agency, invite staff, register vehicles and let DriveSafe enforce the small rules that prevent costly rental mistakes.</p></div><div className="setup-steps"><div><b>1</b><span>Create agency</span></div><div><b>2</b><span>Add vehicles</span></div><div><b>3</b><span>Start rentals</span></div></div></aside>
    <main className="auth-form-wrap"><form className="auth-card" onSubmit={submit}><div className="mobile-auth-brand"><div className="brand-mark"><Icon name="shield" size={19}/></div><span>DriveSafe</span></div><div><span className="eyebrow">New workspace</span><h2>Create your agency</h2><p>Your first account is created as the agency admin.</p></div>{error && <div className="alert error">{error}</div>}<label>Agency name<input value={form.agencyName} onChange={set('agencyName')} placeholder="Northline Rentals" required /></label><label>Your name<input value={form.adminName} onChange={set('adminName')} placeholder="Maya Chen" required /></label><label>Work email<input type="email" value={form.email} onChange={set('email')} placeholder="maya@northlinerentals.com" required /></label><label>Password<input type="password" minLength="8" value={form.password} onChange={set('password')} placeholder="Minimum 8 characters" required /></label><button className="primary auth-submit">Create workspace <Icon name="arrow" size={16}/></button><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></form></main>
  </div>
}
