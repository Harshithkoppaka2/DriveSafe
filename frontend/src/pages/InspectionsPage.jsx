import { useEffect, useMemo, useState } from 'react'
import { rentalApi, vehicleApi } from '../api/http.js'
import Icon from '../components/Icon.jsx'
import { longDate, titleCase } from '../utils/format.js'

export default function InspectionsPage() {
  const [rentals, setRentals] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [inspections, setInspections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([rentalApi.get('/api/rentals'), vehicleApi.get('/api/vehicles')]).then(async ([r, v]) => {
      setRentals(r.data); setVehicles(v.data)
      const all = await Promise.all(r.data.map(rental => rentalApi.get(`/api/rentals/${rental.id}/inspections`).then(x => x.data.map(i => ({ ...i, rental })) ).catch(() => [])))
      setInspections(all.flat().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }).finally(() => setLoading(false))
  }, [])

  const vehicleMap = useMemo(() => Object.fromEntries(vehicles.map(v => [v.id, v])), [vehicles])
  const completedPairs = rentals.filter(r => {
    const records = inspections.filter(i => i.rentalId === r.id)
    return records.some(i => i.type === 'PICKUP') && records.some(i => i.type === 'RETURN')
  }).length

  return <>
    <section className="inspection-summary-grid">
      <div className="inspection-summary-card"><Icon name="camera" /><div><strong>{inspections.length}</strong><span>Condition records</span></div></div>
      <div className="inspection-summary-card"><Icon name="check" /><div><strong>{completedPairs}</strong><span>Complete before/after sets</span></div></div>
      <div className="inspection-summary-card"><Icon name="alert" /><div><strong>{Math.max(0, rentals.filter(r => r.status === 'ACTIVE').length - inspections.filter(i => i.type === 'PICKUP').length)}</strong><span>Pickup records to review</span></div></div>
    </section>

    <section className="panel">
      <div className="panel-header"><div><h3>Condition evidence</h3><p>Photos and notes stay attached to the rental that created them.</p></div></div>
      {loading ? <p className="empty-copy">Loading condition records…</p> : inspections.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icon name="camera" /></div><h3>No condition records yet</h3><p>Add pickup or return inspections from the Rentals page.</p></div> :
        <div className="inspection-grid">{inspections.map(item => {
          const vehicle = vehicleMap[item.rental.vehicleId]
          return <article className="inspection-card" key={item.id}>
            <div className="inspection-card-photo"><img src={item.photoUrl} alt="Vehicle condition" onError={e => { e.currentTarget.style.display = 'none' }} /><div className="image-fallback"><Icon name="camera" size={28} /><span>Condition photo</span></div><span className={`inspection-type ${item.type.toLowerCase()}`}>{titleCase(item.type)}</span></div>
            <div className="inspection-card-body"><div className="vehicle-cell"><div className="vehicle-thumb compact">{vehicle ? `${vehicle.make[0]}${vehicle.model[0]}` : 'V'}</div><div><strong>{vehicle ? `${vehicle.make} ${vehicle.model}` : `Vehicle #${item.rental.vehicleId}`}</strong><span>{item.rental.customerName} · {longDate(item.rental.startDate)}</span></div></div><p>{item.notes || 'No condition notes were recorded.'}</p><div className="inspection-meta"><span><Icon name="clock" size={14}/>{new Date(item.createdAt).toLocaleString()}</span><a href={item.photoUrl} target="_blank" rel="noreferrer">Original photo</a></div></div>
          </article>
        })}</div>}
    </section>
  </>
}
