export const formatPKR = (val) => {
  const n = Number(val) || 0
  return `Rs. ${n.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`
}

export const formatCount = (val) => {
  const n = Number(val) || 0
  return n.toLocaleString('en-US')
}

export const startOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1)
export const endOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
export const startOfPrevMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
export const endOfPrevMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 0)

export const toIsoDate = (date) => {
  if (!date) return null
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'secondary'
    case 'reserved':
      return 'info'
    case 'shipped':
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'primary'
  }
}

export const getPaymentColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'success'
    case 'partial':
      return 'warning'
    case 'unpaid':
      return 'danger'
    case 'refunded':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export const prettyLabel = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

export const PERIODS = [
  { key: 'this_month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'last_7_days', label: 'Last 7 Days' },
  { key: 'last_30_days', label: 'Last 30 Days' },
  { key: 'this_year', label: 'This Year' },
]

export const getPeriodRange = (key) => {
  const now = new Date()
  const startDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  switch (key) {
    case 'last_month': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const to = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: toIsoDate(from), to: toIsoDate(to) }
    }
    case 'last_7_days': {
      const from = startDay(now)
      from.setDate(from.getDate() - 6)
      return { from: toIsoDate(from), to: toIsoDate(now) }
    }
    case 'last_30_days': {
      const from = startDay(now)
      from.setDate(from.getDate() - 29)
      return { from: toIsoDate(from), to: toIsoDate(now) }
    }
    case 'this_year': {
      const from = new Date(now.getFullYear(), 0, 1)
      return { from: toIsoDate(from), to: toIsoDate(now) }
    }
    case 'this_month':
    default:
      return { from: toIsoDate(startOfMonth()), to: toIsoDate(now) }
  }
}

export const getPreviousPeriodRange = (fromIso, toIso) => {
  const days = Math.max(
    1,
    Math.round((new Date(toIso) - new Date(fromIso)) / (24 * 3600 * 1000)) + 1
  )
  const prevTo = new Date(fromIso)
  prevTo.setDate(prevTo.getDate() - 1)
  const prevFrom = new Date(prevTo)
  prevFrom.setDate(prevFrom.getDate() - (days - 1))
  return { from: toIsoDate(prevFrom), to: toIsoDate(prevTo) }
}
