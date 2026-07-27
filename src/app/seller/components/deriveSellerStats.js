// Derive seller-scoped stats from the FilterSales response so we never call
// admin-only endpoints (which trigger authapi.js forceLogout on FORBIDDEN).

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const inDateRange = (dateStr, from, to) => {
  if (!dateStr) return false
  const t = new Date(dateStr).getTime()
  if (Number.isNaN(t)) return false
  const fromT = from ? new Date(from).setHours(0, 0, 0, 0) : -Infinity
  const toT = to ? new Date(to).setHours(23, 59, 59, 999) : Infinity
  return t >= fromT && t <= toT
}

export const filterSalesByRange = (sales = [], from, to) =>
  sales.filter((s) => inDateRange(s.createdAt, from, to))

export const deriveStats = (sales = []) => {
  const totalRevenue = sales.reduce((a, s) => a + (Number(s.totalAmount) || 0), 0)
  const totalOrders = sales.length
  const paidAmount = sales.reduce((a, s) => a + (Number(s.payment?.paidAmount) || 0), 0)
  const balanceAmount = sales.reduce((a, s) => a + (Number(s.payment?.balanceAmount) || 0), 0)
  const codPending = sales
    .filter((s) => (s.payment?.mode || '').toLowerCase() === 'cod' && (s.payment?.status || '').toLowerCase() !== 'paid')
    .reduce((a, s) => a + (Number(s.payment?.balanceAmount ?? s.totalAmount) || 0), 0)

  const buckets = {}
  sales.forEach((s) => {
    const k = (s.status || 'draft').toLowerCase()
    buckets[k] = (buckets[k] || 0) + 1
  })
  const statusBreakdown = Object.entries(buckets).map(([status, orders]) => ({ status, orders }))

  const pendingOrders =
    (buckets.draft || 0) + (buckets.pending || 0) + (buckets.confirmed || 0)
  const deliveredOrders = buckets.delivered || 0
  const cancelledOrders = buckets.cancelled || 0
  const returnedOrders = buckets.returned || 0

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    returnedOrders,
    paidAmount,
    balanceAmount,
    codPending,
    statusBreakdown,
  }
}

export const deriveSalesTrend = (sales = [], _from, _to, { padEmptyDays = false } = {}) => {
  if (!sales.length) return []
  const map = new Map()
  sales.forEach((s) => {
    if (!s.createdAt) return
    const d = new Date(s.createdAt)
    if (Number.isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const existing = map.get(key) || { date: key, revenue: 0, orders: 0 }
    existing.revenue += Number(s.totalAmount) || 0
    existing.orders += 1
    map.set(key, existing)
  })

  if (padEmptyDays && _from && _to) {
    const start = new Date(_from)
    const end = new Date(_to)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (!map.has(key)) map.set(key, { date: key, revenue: 0, orders: 0 })
    }
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export const deriveTopProducts = (sales = [], limit = 5) => {
  const map = new Map()
  sales.forEach((s) => {
    ;(s.items || []).forEach((it) => {
      const key = it.product || it.sku || it.productName
      if (!key) return
      const existing = map.get(key) || {
        product: it.product,
        productName: it.productName || it.sku,
        sku: it.sku,
        quantity: 0,
        revenue: 0,
      }
      existing.quantity += Number(it.quantity) || 0
      existing.revenue += Number(it.lineTotal) || (Number(it.salePrice) || 0) * (Number(it.quantity) || 0)
      map.set(key, existing)
    })
  })
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export const deriveTopCustomers = (sales = [], limit = 5) => {
  const map = new Map()
  sales.forEach((s) => {
    const key = s.customerPhone || s.customerName
    if (!key) return
    const existing = map.get(key) || { name: s.customerName || 'Unknown', total: 0 }
    existing.total += Number(s.totalAmount) || 0
    map.set(key, existing)
  })
  const arr = Array.from(map.values()).sort((a, b) => b.total - a.total)
  const max = arr[0]?.total || 0
  return arr.slice(0, limit).map((c) => ({ ...c, pct: max ? (c.total / max) * 100 : 0 }))
}

export const deriveUnitsSold = (sales = []) =>
  sales.reduce(
    (a, s) => a + (s.items || []).reduce((x, it) => x + (Number(it.quantity) || 0), 0),
    0
  )

export { isSameDay }
