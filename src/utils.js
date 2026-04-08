export const peso = (v) =>
  `₱${parseFloat(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const AV_COLORS = ['#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4']
export const avColor = (n) => AV_COLORS[n.charCodeAt(0) % AV_COLORS.length]
export const initials = (n) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

export function computeStock(cioRecords) {
  return cioRecords.reduce((s, r) => {
    if (r.type === 'in' || r.type === 'restore') return s + r.qty
    if (r.type === 'out') return s - r.qty
    return s
  }, 0)
}

export function getCustomer(customers, id) {
  return customers.find(c => c.id === id) || { name: 'Unknown' }
}

export function getService(services, id) {
  return services.find(s => s.id === id) || { name: '?', price: 0, unit: '' }
}

export function calcLineTotal(line, services) {
  const svcTotal = (line.serviceIds || []).reduce((s, sid) => {
    const svc = services.find(sv => sv.id === sid)
    return s + (svc ? svc.price * line.qty : 0)
  }, 0)
  return line.qty * line.pricePerBlock + svcTotal
}
