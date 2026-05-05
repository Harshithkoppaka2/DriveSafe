export function number(value) {
  return Number(value || 0).toLocaleString()
}

export function shortDate(value) {
  if (!value) return '—'
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function longDate(value) {
  if (!value) return '—'
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'DS'
}

export function titleCase(value = '') {
  return value.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}
