import { Badge, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

/**
 * SaleStatusChip — shared status pill / action button for sales rows.
 *
 * Renders one of:
 *   - draft            → dark grey badge
 *   - confirmed        → orange (primary) badge
 *   - out_for_delivery → blue (info) badge
 *   - delivered        → green (success) badge
 *   - cancelled        → red (danger) badge
 *   - mark_paid        → green button with a dollar icon (clickable)
 *
 * Usage:
 *   <SaleStatusChip status="confirmed" />
 *   <SaleStatusChip status="mark_paid" onClick={handleMarkPaid} loading={isSaving} />
 *
 * Props:
 *   status   string    — one of the keys above
 *   onClick  function  — only used when status === 'mark_paid'
 *   loading  boolean   — disables + swaps label to "Saving..." (mark_paid only)
 *   size     'sm' | 'md' — button size for mark_paid (default 'sm')
 *   label    string    — override the displayed text
 */
const STATUS_CONFIG = {
  draft:            { color: 'secondary', label: 'Draft' },
  confirmed:        { color: 'primary',   label: 'Confirmed' },
  out_for_delivery: { color: 'info',      label: 'Out For Delivery' },
  delivered:        { color: 'success',   label: 'Delivered' },
  cancelled:        { color: 'danger',    label: 'Cancelled' },
}

const SaleStatusChip = ({ status, onClick, loading = false, size = 'sm', label }) => {
  const key = String(status || '').toLowerCase()

  if (key === 'mark_paid') {
    return (
      <Button
        variant="success"
        size={size}
        onClick={onClick}
        disabled={loading}
        className="d-inline-flex align-items-center gap-1"
      >
        <IconifyIcon icon="bx:dollar" />
        <span>{loading ? 'Saving...' : (label || 'Mark Paid')}</span>
      </Button>
    )
  }

  const cfg = STATUS_CONFIG[key] || { color: 'secondary', label: label || status || 'Unknown' }
  return (
    <Badge bg={cfg.color} className="text-capitalize px-2 py-1">
      {label || cfg.label}
    </Badge>
  )
}

export default SaleStatusChip
