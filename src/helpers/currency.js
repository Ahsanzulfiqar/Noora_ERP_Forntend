import { currency, currencyLocale } from '@/context/constants'

export { currency, currencyLocale }

const toNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

/**
 * Grouped number, no symbol — for tables that name the currency in the
 * column header (ledger, trial balance, voucher lines).
 * formatAmount(1234.5) => '1,234.50'
 */
export const formatAmount = (value, { decimals = 2 } = {}) =>
  toNumber(value).toLocaleString(currencyLocale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

/**
 * Standard money display.
 * formatCurrency(1234.5) => 'AED 1,234.50'
 */
export const formatCurrency = (value, { decimals = 2 } = {}) => `${currency} ${formatAmount(value, { decimals })}`

/**
 * Money rounded to whole units — used where the UI deliberately omits
 * fractions (seller and warehouse dashboards, KPI tiles).
 * formatCurrencyRounded(1234.5) => 'AED 1,235'
 */
export const formatCurrencyRounded = (value) => formatCurrency(value, { decimals: 0 })

/**
 * Abbreviated money for stat tiles and chart axes.
 * formatCurrencyCompact(1250000) => 'AED 1.3M'
 * formatCurrencyCompact(5400)    => 'AED 5.4k'
 */
export const formatCurrencyCompact = (value, { decimals = 1 } = {}) => {
  const n = toNumber(value)
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${currency} ${(n / 1_000_000).toFixed(decimals)}M`
  if (abs >= 1_000) return `${currency} ${(n / 1_000).toFixed(decimals)}k`
  return `${currency} ${n.toLocaleString(currencyLocale)}`
}

/**
 * Abbreviated number without the symbol — for dense chart axis labels where
 * repeating the symbol on every tick is noise.
 * formatAmountCompact(5400) => '5.4k'
 */
export const formatAmountCompact = (value, { decimals = 0 } = {}) => {
  const n = toNumber(value)
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(decimals)}k`
  return n.toLocaleString(currencyLocale)
}

export const currencyLabel = () => `(${currency})`
