import Icon from './Icon'

export default function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div>
      {children}
    </div>
  </div>
}
