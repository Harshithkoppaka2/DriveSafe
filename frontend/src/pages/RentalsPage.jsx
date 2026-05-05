import { useEffect, useMemo, useState } from 'react'
import { errorMessage, rentalApi, vehicleApi } from '../api/http'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import { longDate, shortDate, titleCase } from '../utils/format'

const emptyRental = { vehicleId: '', customerName: '', customerEmail: '', startDate: '', endDate: '' }
const emptyInspection = { type: 'PICKUP', photoUrl: '', notes: '' }

export default function RentalsPage() {
  const [rentals, setRentals] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyRental)
  const [error, setError] = useState('')
  const [action, setAction] = useState(null)
  const [extensionDate, setExtensionDate] = useState('')
  const [inspection, setInspection] = useState(emptyInspection)
  const [inspectionHistory, setInspectionHistory] = useState([])
  const [filter, setFilter] = useState('ALL')

  const load = () => Promise.all([rentalApi.get('/api/rentals'), vehicleApi.get('/api/vehicles')]).then(([r, v]) => { setRentals(r.data); setVehicles(v.data) })
  useEffect(() => { load() }, [])

  const vehicleMap = useMemo(() => Object.fromEntries(vehicles.map(v => [v.id, v])), [vehicles])
  const filtered = filter === 'ALL' ? rentals : rentals.filter(r => r.status === filter)
  const set = key => event => setForm({ ...form, [key]: event.target.value })

  async function createRental(event) {
    event.preventDefault(); setError('')
    try {
      await rentalApi.post('/api/rentals', { ...form, vehicleId: Number(form.vehicleId) })
      setForm(emptyRental); setAction(null); load()
    } catch (err) { setError(errorMessage(err)) }
  }

  function openExtension(rental) { setAction({ type: 'extend', rental }); setExtensionDate(rental.endDate) }
  function openInspection(rental) { setAction({ type: 'inspection', rental }); setInspection(emptyInspection) }

  async function openInspectionHistory(rental) {
    setError('')
    try {
      const { data } = await rentalApi.get(`/api/rentals/${rental.id}/inspections`)
      setInspectionHistory(data); setAction({ type: 'history', rental })
    } catch (err) { setError(errorMessage(err)) }
  }

  async function saveExtension(event) {
    event.preventDefault(); setError('')
    try {
      await rentalApi.put(`/api/rentals/${action.rental.id}/extend`, { requestedEndDate: extensionDate })
      setAction(null); load()
    } catch (err) { setError(errorMessage(err)) }
  }

  async function saveInspection(event) {
    event.preventDefault(); setError('')
    try {
      await rentalApi.post(`/api/rentals/${action.rental.id}/inspections`, inspection)
      setAction(null)
    } catch (err) { setError(errorMessage(err)) }
  }

  return <>
    <div className="page-actions-row rental-actions">
      <div className="filter-tabs">
        {['ALL','ACTIVE','RESERVED','COMPLETED'].map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item === 'ALL' ? 'All rentals' : titleCase(item)}</button>)}
      </div>
      <button className="primary button" onClick={() => setAction({ type: 'new' })}><Icon name="plus" size={16} /> New rental</button>
    </div>

    {error && <div className="alert error">{error}</div>}

    <section className="rental-summary-grid">
      <RentalSummary label="Active now" value={rentals.filter(r => r.status === 'ACTIVE').length} detail="Vehicles currently out" icon="car" />
      <RentalSummary label="Upcoming" value={rentals.filter(r => r.status === 'RESERVED').length} detail="Scheduled handoffs" icon="calendar" />
      <RentalSummary label="Completed" value={rentals.filter(r => r.status === 'COMPLETED').length} detail="Rental history" icon="check" />
    </section>

    <section className="panel rentals-panel">
      <div className="panel-header table-title"><div><h3>Rental activity</h3><p>Every assignment passes vehicle readiness and date-conflict checks.</p></div></div>
      {filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icon name="rental" /></div><h3>No rentals in this view</h3><p>Create a rental or choose another status.</p></div> :
        <div className="rental-cards">{filtered.map(rental => {
          const vehicle = vehicleMap[rental.vehicleId]
          return <article className="rental-card" key={rental.id}>
            <div className="rental-card-top">
              <div className="vehicle-cell"><div className="vehicle-thumb">{vehicle ? `${vehicle.make[0]}${vehicle.model[0]}` : 'V'}</div><div><strong>{vehicle ? `${vehicle.make} ${vehicle.model}` : `Vehicle #${rental.vehicleId}`}</strong><span>{vehicle ? `${vehicle.modelYear} · …${vehicle.vin.slice(-6)}` : 'Vehicle record'}</span></div></div>
              <StatusBadge value={rental.status} />
            </div>
            <div className="rental-customer"><div className="avatar small-avatar">{rental.customerName.split(' ').map(p => p[0]).slice(0,2).join('')}</div><div><strong>{rental.customerName}</strong><span>{rental.customerEmail}</span></div></div>
            <div className="rental-window"><div><span>Pickup</span><strong>{longDate(rental.startDate)}</strong></div><Icon name="arrow" size={17} /><div><span>Return</span><strong>{longDate(rental.endDate)}</strong></div></div>
            <div className="rental-card-actions">
              {['ACTIVE','RESERVED'].includes(rental.status) && <button className="secondary" onClick={() => openExtension(rental)}><Icon name="calendar" size={15} /> Extend</button>}
              <button className="secondary" onClick={() => openInspection(rental)}><Icon name="camera" size={15} /> Add inspection</button>
              <button className="secondary" onClick={() => openInspectionHistory(rental)}>Condition history</button>
            </div>
          </article>
        })}</div>}
    </section>

    {action?.type === 'new' && <Modal title="Create rental" onClose={() => setAction(null)}>
      <form className="form-card modal-form" onSubmit={createRental}>
        <div className="form-intro">Only road-ready vehicles can be assigned. Date conflicts are checked when you submit.</div>
        <label>Vehicle<select value={form.vehicleId} onChange={set('vehicleId')} required><option value="">Select a ready vehicle</option>{vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id} disabled={!vehicle.rentable}>{vehicle.make} {vehicle.model} · {titleCase(vehicle.maintenanceStatus)}</option>)}</select></label>
        <div className="two-col"><label>Customer name<input value={form.customerName} onChange={set('customerName')} placeholder="Jordan Lee" required /></label><label>Customer email<input type="email" value={form.customerEmail} onChange={set('customerEmail')} placeholder="jordan@example.com" required /></label></div>
        <div className="two-col"><label>Pickup date<input type="date" value={form.startDate} onChange={set('startDate')} required /></label><label>Return date<input type="date" value={form.endDate} onChange={set('endDate')} required /></label></div>
        <div className="modal-actions"><button className="secondary" type="button" onClick={() => setAction(null)}>Cancel</button><button className="primary">Create rental</button></div>
      </form>
    </Modal>}

    {action?.type === 'extend' && <Modal title="Extend rental" onClose={() => setAction(null)}>
      <form className="form-card modal-form" onSubmit={saveExtension}>
        <div className="extension-summary"><Icon name="calendar" /><div><span>Current rental</span><strong>{shortDate(action.rental.startDate)} → {shortDate(action.rental.endDate)}</strong></div></div>
        <label>Requested return date<input type="date" value={extensionDate} onChange={e => setExtensionDate(e.target.value)} required autoFocus /></label>
        <div className="info-box"><Icon name="shield" size={16} /> DriveSafe checks the vehicle’s next reservation before approving this extension.</div>
        <div className="modal-actions"><button className="secondary" type="button" onClick={() => setAction(null)}>Cancel</button><button className="primary">Check availability</button></div>
      </form>
    </Modal>}

    {action?.type === 'inspection' && <Modal title="Record vehicle condition" onClose={() => setAction(null)}>
      <form className="form-card modal-form" onSubmit={saveInspection}>
        <label>Inspection stage<select value={inspection.type} onChange={e => setInspection({ ...inspection, type: e.target.value })}><option value="PICKUP">Pickup</option><option value="RETURN">Return</option></select></label>
        <label>Condition photo URL<input type="url" value={inspection.photoUrl} onChange={e => setInspection({ ...inspection, photoUrl: e.target.value })} placeholder="https://images.example.com/vehicle.jpg" required /></label>
        <label>Condition notes<textarea value={inspection.notes} onChange={e => setInspection({ ...inspection, notes: e.target.value })} placeholder="Small scratch on rear bumper, passenger side." /></label>
        <div className="modal-actions"><button className="secondary" type="button" onClick={() => setAction(null)}>Cancel</button><button className="primary">Save condition record</button></div>
      </form>
    </Modal>}

    {action?.type === 'history' && <Modal title="Condition history" onClose={() => setAction(null)}>
      {inspectionHistory.length === 0 ? <div className="empty-state mini"><div className="empty-icon"><Icon name="camera" /></div><h3>No inspections yet</h3><p>Record pickup and return condition to create a clear trail.</p></div> :
        <div className="inspection-history">{inspectionHistory.map(item => <article key={item.id} className="inspection-history-item"><div className="inspection-photo"><img src={item.photoUrl} alt={`${item.type.toLowerCase()} inspection`} onError={e => { e.currentTarget.style.display = 'none' }} /><Icon name="camera" /></div><div className="inspection-copy"><div><StatusBadge value={item.type} /><span className="muted small">{new Date(item.createdAt).toLocaleString()}</span></div><p>{item.notes || 'No condition notes recorded.'}</p><a href={item.photoUrl} target="_blank" rel="noreferrer">Open original photo</a></div></article>)}</div>}
    </Modal>}
  </>
}

function RentalSummary({ label, value, detail, icon }) { return <article className="rental-summary"><div className="metric-icon blue"><Icon name={icon} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article> }
function StatusBadge({ value }) { return <span className={`status-pill status-${value.toLowerCase()}`}><span className="status-dot" />{titleCase(value)}</span> }
