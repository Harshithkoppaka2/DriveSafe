import { useEffect, useMemo, useState } from 'react'
import { errorMessage, vehicleApi } from '../api/http'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import { number, titleCase } from '../utils/format'

export default function MaintenancePage() {
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [mileage, setMileage] = useState('')
  const load = () => vehicleApi.get('/api/vehicles').then(r => setVehicles(r.data))
  useEffect(() => { load() }, [])

  const sorted = useMemo(() => [...vehicles].sort((a,b) => a.milesToService - b.milesToService), [vehicles])
  const compliance = vehicles.length ? Math.round((vehicles.filter(v => v.maintenanceStatus === 'READY').length / vehicles.length) * 100) : 100

  function record(vehicle) { setSelected(vehicle); setMileage(String(vehicle.currentMileage)) }
  async function save(e) {
    e.preventDefault(); setError('')
    try { await vehicleApi.post(`/api/vehicles/${selected.id}/maintenance/oil-change`, { serviceMileage: Number(mileage) }); setSelected(null); load() }
    catch (err) { setError(errorMessage(err)) }
  }

  return <>
    {error && <div className="alert error">{error}</div>}
    <section className="maintenance-hero">
      <div className="maintenance-score"><div className="score-ring" style={{ '--score': `${compliance * 3.6}deg` }}><div><strong>{compliance}%</strong><span>service compliant</span></div></div></div>
      <div className="maintenance-hero-copy"><span className="eyebrow">Preventive maintenance</span><h2>Keep cars rentable before they reach the counter.</h2><p>DriveSafe calculates remaining oil-service mileage from odometer readings and automatically blocks overdue vehicles from new assignments.</p></div>
      <div className="maintenance-kpis"><div><strong>{vehicles.filter(v => v.maintenanceStatus === 'DUE_SOON').length}</strong><span>Due soon</span></div><div><strong>{vehicles.filter(v => v.maintenanceStatus === 'OVERDUE').length}</strong><span>Overdue</span></div></div>
    </section>

    <section className="panel">
      <div className="panel-header"><div><h3>Service queue</h3><p>Sorted by the vehicles that need attention first.</p></div><span className="muted small">Default interval: 5,000 mi</span></div>
      <div className="maintenance-list">
        {sorted.map(vehicle => {
          const used = Math.max(0, vehicle.currentMileage - vehicle.lastOilChangeMileage)
          const pct = Math.min(100, Math.round((used / vehicle.serviceIntervalMiles) * 100))
          return <article className="maintenance-row" key={vehicle.id}>
            <div className="vehicle-cell"><div className="vehicle-thumb">{vehicle.make[0]}{vehicle.model[0]}</div><div><strong>{vehicle.make} {vehicle.model}</strong><span>{vehicle.modelYear} · {number(vehicle.currentMileage)} mi</span></div></div>
            <div className="service-progress"><div className="progress-label"><span>{number(used)} of {number(vehicle.serviceIntervalMiles)} mi</span><strong className={vehicle.milesToService < 0 ? 'text-danger' : ''}>{vehicle.milesToService < 0 ? `${number(Math.abs(vehicle.milesToService))} mi overdue` : `${number(vehicle.milesToService)} mi remaining`}</strong></div><div className="progress-track"><div className={`progress-fill ${vehicle.maintenanceStatus.toLowerCase()}`} style={{ width: `${pct}%` }} /></div><span className="cell-sub">Last service at {number(vehicle.lastOilChangeMileage)} mi</span></div>
            <StatusBadge value={vehicle.maintenanceStatus} />
            <button className="secondary" onClick={() => record(vehicle)}>Record service</button>
          </article>
        })}
      </div>
    </section>

    <section className="maintenance-rule-card"><div className="rule-icon"><Icon name="shield" /></div><div><strong>Automatic rental safeguard</strong><p>If a vehicle moves into <b>Overdue</b>, Vehicle Service returns it as not rentable. Rental Service rejects the assignment before a reservation can be created.</p></div></section>

    {selected && <Modal title="Record oil service" onClose={() => setSelected(null)}><form className="form-card modal-form" onSubmit={save}><div className="vehicle-cell"><div className="vehicle-thumb">{selected.make[0]}{selected.model[0]}</div><div><strong>{selected.make} {selected.model}</strong><span>Current odometer · {number(selected.currentMileage)} mi</span></div></div><label>Service mileage<div className="input-suffix"><input type="number" min="0" max={selected.currentMileage} value={mileage} onChange={e => setMileage(e.target.value)} required autoFocus/><span>mi</span></div></label><div className="modal-actions"><button className="secondary" type="button" onClick={() => setSelected(null)}>Cancel</button><button className="primary">Record service</button></div></form></Modal>}
  </>
}

function StatusBadge({ value }) { return <span className={`status-pill status-${value.toLowerCase()}`}><span className="status-dot" />{titleCase(value)}</span> }
