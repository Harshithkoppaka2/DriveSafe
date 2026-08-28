import { useEffect, useMemo, useState } from 'react'
import { errorMessage, vehicleApi } from '../api/http.js'
import Modal from '../components/Modal.jsx'
import Icon from '../components/Icon.jsx'
import { number, titleCase } from '../utils/format.js'

const emptyVehicle = {
  vin: '', make: '', model: '', modelYear: new Date().getFullYear(),
  currentMileage: '', lastOilChangeMileage: '', serviceIntervalMiles: 5000
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyVehicle)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [action, setAction] = useState(null)
  const [actionMileage, setActionMileage] = useState('')

  const load = () => vehicleApi.get('/api/vehicles').then(response => setVehicles(response.data))
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => vehicles.filter(vehicle => {
    const text = `${vehicle.make} ${vehicle.model} ${vehicle.vin}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (status === 'ALL' || vehicle.maintenanceStatus === status)
  }), [vehicles, query, status])

  const set = key => event => setForm({ ...form, [key]: event.target.value })

  async function addVehicle(event) {
    event.preventDefault(); setError('')
    try {
      await vehicleApi.post('/api/vehicles', {
        ...form,
        modelYear: Number(form.modelYear), currentMileage: Number(form.currentMileage),
        lastOilChangeMileage: Number(form.lastOilChangeMileage), serviceIntervalMiles: Number(form.serviceIntervalMiles)
      })
      setForm(emptyVehicle); setAction(null); load()
    } catch (err) { setError(errorMessage(err)) }
  }

  function openMileageAction(type, vehicle) {
    setAction({ type, vehicle })
    setActionMileage(String(vehicle.currentMileage))
  }

  async function saveMileageAction(event) {
    event.preventDefault(); setError('')
    try {
      if (action.type === 'mileage') {
        await vehicleApi.put(`/api/vehicles/${action.vehicle.id}/mileage`, { currentMileage: Number(actionMileage) })
      } else {
        await vehicleApi.post(`/api/vehicles/${action.vehicle.id}/maintenance/oil-change`, { serviceMileage: Number(actionMileage) })
      }
      setAction(null); load()
    } catch (err) { setError(errorMessage(err)) }
  }

  return <>
    <div className="page-actions-row">
      <div className="search-box"><Icon name="search" size={16} /><input placeholder="Search make, model or VIN" value={query} onChange={e => setQuery(e.target.value)} /></div>
      <div className="filter-tabs">
        {['ALL','READY','DUE_SOON','OVERDUE'].map(item => <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item === 'ALL' ? 'All vehicles' : titleCase(item)}</button>)}
      </div>
      <button className="primary button" onClick={() => setAction({ type: 'add' })}><Icon name="plus" size={16} /> Add vehicle</button>
    </div>

    {error && <div className="alert error">{error}</div>}

    <section className="vehicle-summary-row">
      <Summary label="Total fleet" value={vehicles.length} />
      <Summary label="Road ready" value={vehicles.filter(v => v.maintenanceStatus === 'READY').length} tone="success" />
      <Summary label="Due soon" value={vehicles.filter(v => v.maintenanceStatus === 'DUE_SOON').length} tone="warning" />
      <Summary label="Blocked" value={vehicles.filter(v => !v.rentable).length} tone="danger" />
    </section>

    <section className="panel">
      <div className="panel-header table-title">
        <div><h3>Fleet inventory</h3><p>{filtered.length} of {vehicles.length} vehicles shown</p></div>
      </div>
      {filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icon name="car" /></div><h3>No vehicles found</h3><p>Add a vehicle or change your filters.</p></div> :
        <div className="table-wrap fleet-table"><table>
          <thead><tr><th>Vehicle</th><th>Odometer</th><th>Next oil service</th><th>Availability</th><th>Readiness</th><th></th></tr></thead>
          <tbody>{filtered.map(vehicle => <tr key={vehicle.id}>
            <td><VehicleCell vehicle={vehicle} /></td>
            <td><strong>{number(vehicle.currentMileage)}</strong><span className="cell-sub">miles</span></td>
            <td>
              <div className="service-cell"><strong className={vehicle.milesToService < 0 ? 'text-danger' : ''}>{vehicle.milesToService < 0 ? `${number(Math.abs(vehicle.milesToService))} overdue` : `${number(vehicle.milesToService)} mi`}</strong>
              <span>{number(vehicle.lastOilChangeMileage + vehicle.serviceIntervalMiles)} mi target</span></div>
            </td>
            <td><span className={`availability-pill ${vehicle.rentable ? 'available' : 'blocked'}`}>{vehicle.rentable ? 'Available' : 'Blocked'}</span></td>
            <td><StatusBadge value={vehicle.maintenanceStatus} /></td>
            <td><div className="row-actions nowrap"><button className="table-action" onClick={() => openMileageAction('mileage', vehicle)}>Mileage</button><button className="table-action" onClick={() => openMileageAction('service', vehicle)}>Service</button></div></td>
          </tr>)}</tbody>
        </table></div>}
    </section>

    {action?.type === 'add' && <Modal title="Add vehicle" onClose={() => setAction(null)}>
      <form className="form-card modal-form" onSubmit={addVehicle}>
        <div className="form-intro">Add the vehicle and its current maintenance baseline. DriveSafe calculates readiness automatically.</div>
        <label>VIN<input value={form.vin} onChange={set('vin')} placeholder="1HGCM82633A004352" required /></label>
        <div className="two-col"><label>Make<input value={form.make} onChange={set('make')} placeholder="Toyota" required /></label><label>Model<input value={form.model} onChange={set('model')} placeholder="Camry" required /></label></div>
        <div className="two-col"><label>Year<input type="number" value={form.modelYear} onChange={set('modelYear')} required /></label><label>Current mileage<input type="number" value={form.currentMileage} onChange={set('currentMileage')} placeholder="48200" required /></label></div>
        <div className="two-col"><label>Last oil change<input type="number" value={form.lastOilChangeMileage} onChange={set('lastOilChangeMileage')} placeholder="45000" required /></label><label>Service interval<input type="number" value={form.serviceIntervalMiles} onChange={set('serviceIntervalMiles')} required /></label></div>
        <div className="modal-actions"><button className="secondary" type="button" onClick={() => setAction(null)}>Cancel</button><button className="primary">Add vehicle</button></div>
      </form>
    </Modal>}

    {['mileage','service'].includes(action?.type) && <Modal title={action.type === 'mileage' ? 'Update odometer' : 'Record oil service'} onClose={() => setAction(null)}>
      <form className="form-card modal-form" onSubmit={saveMileageAction}>
        <VehicleCell vehicle={action.vehicle} />
        <label>{action.type === 'mileage' ? 'Current mileage' : 'Service completed at'}<div className="input-suffix"><input type="number" min="0" value={actionMileage} onChange={e => setActionMileage(e.target.value)} required autoFocus /><span>mi</span></div></label>
        {action.type === 'service' && <div className="info-box"><Icon name="check" size={16} /> Recording service resets the oil-change baseline for this vehicle.</div>}
        <div className="modal-actions"><button className="secondary" type="button" onClick={() => setAction(null)}>Cancel</button><button className="primary">Save update</button></div>
      </form>
    </Modal>}
  </>
}

function VehicleCell({ vehicle }) { return <div className="vehicle-cell"><div className="vehicle-thumb">{vehicle.make?.[0]}{vehicle.model?.[0]}</div><div><strong>{vehicle.make} {vehicle.model}</strong><span>{vehicle.modelYear} · VIN …{vehicle.vin.slice(-6)}</span></div></div> }
function StatusBadge({ value }) { return <span className={`status-pill status-${value.toLowerCase()}`}><span className="status-dot" />{titleCase(value)}</span> }
function Summary({ label, value, tone = '' }) { return <div className={`summary-chip ${tone}`}><span>{label}</span><strong>{value}</strong></div> }
