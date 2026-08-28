import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { rentalApi, vehicleApi } from '../api/http.js'
import Icon from '../components/Icon.jsx'
import { number, shortDate, titleCase } from '../utils/format.js'

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([])
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([vehicleApi.get('/api/vehicles'), rentalApi.get('/api/rentals')])
      .then(([v, r]) => { setVehicles(v.data); setRentals(r.data) })
      .finally(() => setLoading(false))
  }, [])

  const metrics = useMemo(() => {
    const activeRentals = rentals.filter(r => r.status === 'ACTIVE').length
    const reserved = rentals.filter(r => r.status === 'RESERVED').length
    const ready = vehicles.filter(v => v.rentable).length
    const attention = vehicles.filter(v => ['DUE_SOON', 'OVERDUE'].includes(v.maintenanceStatus)).length
    const utilization = vehicles.length ? Math.round(((activeRentals + reserved) / vehicles.length) * 100) : 0
    return { activeRentals, reserved, ready, attention, utilization: Math.min(utilization, 100) }
  }, [vehicles, rentals])

  const serviceQueue = [...vehicles]
    .filter(v => v.maintenanceStatus !== 'READY')
    .sort((a, b) => a.milesToService - b.milesToService)
    .slice(0, 5)

  const activeSchedule = rentals.filter(r => ['ACTIVE', 'RESERVED'].includes(r.status)).slice(0, 5)
  const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]))

  return <>
    <section className="welcome-strip">
      <div>
        <span className="eyebrow">Today’s operation</span>
        <h2>{loading ? 'Loading fleet…' : `${metrics.ready} vehicles ready for the next checkout`}</h2>
        <p>Maintenance blocks are enforced automatically before a rental is created.</p>
      </div>
      <div className="quick-actions">
        <Link className="button primary" to="/rentals"><Icon name="plus" size={16} /> New rental</Link>
        <Link className="button secondary" to="/vehicles"><Icon name="car" size={16} /> Add vehicle</Link>
      </div>
    </section>

    <section className="metrics-grid">
      <Metric icon="car" label="Fleet ready" value={`${metrics.ready}/${vehicles.length}`} helper="Available for rental" tone="blue" />
      <Metric icon="rental" label="Active rentals" value={metrics.activeRentals} helper={`${metrics.reserved} upcoming`} tone="green" />
      <Metric icon="wrench" label="Service attention" value={metrics.attention} helper="Due soon or overdue" tone={metrics.attention ? 'amber' : 'green'} />
      <Metric icon="mileage" label="Fleet utilization" value={`${metrics.utilization}%`} helper="Active + reserved" tone="blue" />
    </section>

    <div className="dashboard-grid">
      <section className="panel span-2">
        <div className="panel-header">
          <div><h3>Vehicle readiness</h3><p>Maintenance-sensitive vehicles are surfaced first.</p></div>
          <Link to="/maintenance" className="text-link">View maintenance <Icon name="chevron" size={14} /></Link>
        </div>
        {serviceQueue.length === 0 ? <HealthyState /> : <div className="table-wrap compact-table">
          <table>
            <thead><tr><th>Vehicle</th><th>Odometer</th><th>Service remaining</th><th>Readiness</th></tr></thead>
            <tbody>{serviceQueue.map(vehicle => <tr key={vehicle.id}>
              <td><VehicleCell vehicle={vehicle} /></td>
              <td>{number(vehicle.currentMileage)} mi</td>
              <td className={vehicle.milesToService < 0 ? 'text-danger' : ''}>{vehicle.milesToService < 0 ? `${number(Math.abs(vehicle.milesToService))} mi overdue` : `${number(vehicle.milesToService)} mi`}</td>
              <td><StatusBadge value={vehicle.maintenanceStatus} /></td>
            </tr>)}</tbody>
          </table>
        </div>}
      </section>

      <section className="panel health-panel">
        <div className="panel-header"><div><h3>Fleet health</h3><p>Readiness distribution</p></div></div>
        <HealthDonut vehicles={vehicles} />
        <div className="health-legend">
          <Legend label="Ready" value={vehicles.filter(v => v.maintenanceStatus === 'READY').length} tone="green" />
          <Legend label="Due soon" value={vehicles.filter(v => v.maintenanceStatus === 'DUE_SOON').length} tone="amber" />
          <Legend label="Overdue" value={vehicles.filter(v => v.maintenanceStatus === 'OVERDUE').length} tone="red" />
        </div>
      </section>

      <section className="panel span-2">
        <div className="panel-header">
          <div><h3>Rental schedule</h3><p>Current handoffs and upcoming reservations.</p></div>
          <Link to="/rentals" className="text-link">All rentals <Icon name="chevron" size={14} /></Link>
        </div>
        {activeSchedule.length === 0 ? <p className="empty-copy">No active or upcoming rentals.</p> : <div className="schedule-list">
          {activeSchedule.map(rental => {
            const vehicle = vehicleMap[rental.vehicleId]
            return <div className="schedule-row" key={rental.id}>
              <div className={`schedule-icon ${rental.status.toLowerCase()}`}><Icon name={rental.status === 'ACTIVE' ? 'car' : 'calendar'} /></div>
              <div className="schedule-main"><strong>{rental.customerName}</strong><span>{vehicle ? `${vehicle.make} ${vehicle.model}` : `Vehicle #${rental.vehicleId}`}</span></div>
              <div className="schedule-dates"><strong>{shortDate(rental.startDate)} → {shortDate(rental.endDate)}</strong><span>{rental.customerEmail}</span></div>
              <StatusBadge value={rental.status} />
            </div>
          })}
        </div>}
      </section>

      <section className="panel operations-panel">
        <div className="panel-header"><div><h3>Operations checklist</h3><p>Small things that prevent expensive mistakes.</p></div></div>
        <Checklist icon="check" title="Maintenance gate" text="Overdue vehicles are blocked before assignment." complete />
        <Checklist icon="calendar" title="Extension conflicts" text="Future reservations are checked before extensions." complete />
        <Checklist icon="camera" title="Condition evidence" text="Pickup and return records stay attached to a rental." complete />
      </section>
    </div>
  </>
}

function Metric({ icon, label, value, helper, tone }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon name={icon} /></div><div><span>{label}</span><strong>{value}</strong><small>{helper}</small></div></article>
}
function VehicleCell({ vehicle }) { return <div className="vehicle-cell"><div className="vehicle-thumb">{vehicle.make?.[0]}{vehicle.model?.[0]}</div><div><strong>{vehicle.make} {vehicle.model}</strong><span>{vehicle.modelYear} · {vehicle.vin.slice(-6)}</span></div></div> }
function StatusBadge({ value }) { return <span className={`status-pill status-${value.toLowerCase()}`}><span className="status-dot" />{titleCase(value)}</span> }
function Legend({ label, value, tone }) { return <div className="legend-row"><span><i className={`legend-dot ${tone}`} />{label}</span><strong>{value}</strong></div> }
function Checklist({ icon, title, text }) { return <div className="checklist-row"><div className="check-circle"><Icon name={icon} size={15} /></div><div><strong>{title}</strong><span>{text}</span></div></div> }
function HealthyState() { return <div className="healthy-state"><div className="healthy-icon"><Icon name="check" /></div><div><strong>Everything is road-ready</strong><p>No vehicles are due for service right now.</p></div></div> }
function HealthDonut({ vehicles }) {
  const total = vehicles.length || 1
  const ready = vehicles.filter(v => v.maintenanceStatus === 'READY').length
  const due = vehicles.filter(v => v.maintenanceStatus === 'DUE_SOON').length
  const readyPct = (ready / total) * 100
  const duePct = (due / total) * 100
  const style = { background: `conic-gradient(#24a46d 0 ${readyPct}%, #e7a23b ${readyPct}% ${readyPct + duePct}%, #d04b4b ${readyPct + duePct}% 100%)` }
  return <div className="donut-wrap"><div className="donut" style={style}><div><strong>{vehicles.length}</strong><span>vehicles</span></div></div></div>
}
