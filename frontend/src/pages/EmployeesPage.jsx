import { useEffect, useState } from 'react'
import { authApi, errorMessage } from '../api/http.js'
import Modal from '../components/Modal.jsx'
import Icon from '../components/Icon.jsx'
import { initials, titleCase } from '../utils/format.js'

const empty = { name: '', email: '', password: '' }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const load = () => authApi.get('/api/employees').then(r => setEmployees(r.data))
  useEffect(() => { load() }, [])
  const set = key => event => setForm({ ...form, [key]: event.target.value })

  async function create(event) {
    event.preventDefault(); setError('')
    try { await authApi.post('/api/employees', form); setForm(empty); setOpen(false); load() }
    catch (err) { setError(errorMessage(err)) }
  }

  return <>
    <div className="page-actions-row"><div><span className="eyebrow">Access control</span><p className="page-inline-copy">Keep agency access limited to the people who operate the fleet.</p></div><button className="primary button" onClick={() => setOpen(true)}><Icon name="plus" size={16}/> Add employee</button></div>
    {error && <div className="alert error">{error}</div>}
    <section className="panel">
      <div className="panel-header"><div><h3>Agency users</h3><p>{employees.length} users have access to this workspace.</p></div></div>
      <div className="team-list">{employees.map(employee => <div className="team-row" key={employee.id}><div className="avatar">{initials(employee.name)}</div><div className="team-identity"><strong>{employee.name}</strong><span>{employee.email}</span></div><span className={`role-pill ${employee.role.toLowerCase()}`}>{titleCase(employee.role)}</span><span className="active-user"><i/>Active</span><button className="icon-button subtle"><Icon name="dots"/></button></div>)}</div>
    </section>
    <section className="permission-note"><Icon name="shield"/><div><strong>Simple roles by design</strong><p>Admins manage staff. Employees can operate vehicles, rentals, maintenance and inspections inside the same agency.</p></div></section>

    {open && <Modal title="Add employee" onClose={() => setOpen(false)}><form className="form-card modal-form" onSubmit={create}><div className="form-intro">The employee will be created inside your agency with operational access.</div><label>Full name<input value={form.name} onChange={set('name')} placeholder="Daniel Ortiz" required/></label><label>Work email<input type="email" value={form.email} onChange={set('email')} placeholder="daniel@northlinerentals.com" required/></label><label>Temporary password<input type="password" minLength="8" value={form.password} onChange={set('password')} placeholder="Minimum 8 characters" required/></label><div className="modal-actions"><button className="secondary" type="button" onClick={() => setOpen(false)}>Cancel</button><button className="primary">Create employee</button></div></form></Modal>}
  </>
}
