export { formatCurrency } from '@/helpers/currency'

export const formatNumber = (val) => {
  const n = Number(val) || 0
  return n.toLocaleString('en-US')
}

export const formatPercent = (val) => {
  const n = Number(val) || 0
  return `${n.toFixed(1)}%`
}

export const toIsoDate = (date) => {
  if (!date) return null
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
