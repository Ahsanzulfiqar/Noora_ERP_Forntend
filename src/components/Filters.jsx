import { Button, Dropdown, Form } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

/**
 * Shared filter widgets. Import individually:
 *   import { FilterSelect, FilterSearch, FilterDateRange, FilterDate, FilterButton, FilterToolbar } from '@/components/Filters'
 */

// ---------- FilterSelect ----------
export const FilterSelect = ({
  value,
  onChange,
  options = [],
  label,
  placeholder,
  size,
  disabled = false,
  style,
  className = '',
  inline = false,
}) => {
  const hasEmptyOption = options.some((o) => o.value === '')
  const select = (
    <Form.Select
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      size={size}
      disabled={disabled}
      style={style}
    >
      {!hasEmptyOption && placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </Form.Select>
  )
  if (inline) {
    return (
      <div className={`d-flex align-items-center gap-2 ${className}`}>
        {label && <Form.Label className="mb-0 text-nowrap">{label}:</Form.Label>}
        {select}
      </div>
    )
  }
  return (
    <div className={className}>
      {label && <Form.Label className="text-muted small mb-1">{label}</Form.Label>}
      {select}
    </div>
  )
}

// ---------- FilterSearch ----------
export const FilterSearch = ({
  value,
  onChange,
  placeholder = 'Search...',
  icon = 'bx:search',
  size,
  disabled = false,
  style,
  className = '',
}) => {
  const inputHeight = size === 'sm' ? 32 : 40
  const iconTop = size === 'sm' ? 7 : 11
  return (
    <div className={`position-relative ${className}`} style={style}>
      <IconifyIcon
        icon={icon}
        className="position-absolute"
        style={{ top: iconTop, left: 10, color: '#9ca3af' }}
      />
      <Form.Control
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        style={{ paddingLeft: 32, height: inputHeight }}
      />
    </div>
  )
}

// ---------- FilterDateRange ----------
const fmtDate = (v) => {
  if (!v) return ''
  const [y, m, d] = v.split('-')
  return `${d}/${m}/${y}`
}

export const FilterDateRange = ({
  from = '',
  to = '',
  onChange,
  placeholder = 'Date range',
  height = 40,
  className = '',
}) => {
  const label =
    from || to ? `${fmtDate(from) || '—'} - ${fmtDate(to) || '—'}` : placeholder
  const setFrom = (v) => onChange?.({ from: v || '', to })
  const setTo = (v) => onChange?.({ from, to: v || '' })

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle
        variant="outline-secondary"
        className={`d-flex align-items-center gap-2 arrow-none ${className}`}
        style={{ height }}
      >
        <IconifyIcon icon="bx:calendar" className="fs-18" />
        <span>{label}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-3" style={{ minWidth: 260 }}>
        <Form.Group className="mb-2">
          <Form.Label className="text-muted small mb-1">From</Form.Label>
          <Form.Control
            type="date"
            value={from || ''}
            onChange={(e) => setFrom(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="text-muted small mb-1">To</Form.Label>
          <Form.Control
            type="date"
            value={to || ''}
            onChange={(e) => setTo(e.target.value)}
          />
        </Form.Group>
      </Dropdown.Menu>
    </Dropdown>
  )
}

// ---------- FilterDate ----------
export const FilterDate = ({
  value,
  onChange,
  label,
  size,
  disabled = false,
  min,
  max,
  style,
  className = '',
  inline = false,
}) => {
  const input = (
    <Form.Control
      type="date"
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      size={size}
      disabled={disabled}
      min={min}
      max={max}
      style={style}
    />
  )
  if (inline) {
    return (
      <div className={`d-flex align-items-center gap-2 ${className}`}>
        {label && <Form.Label className="mb-0 text-nowrap">{label}:</Form.Label>}
        {input}
      </div>
    )
  }
  return (
    <div className={className}>
      {label && <Form.Label className="text-muted small mb-1">{label}</Form.Label>}
      {input}
    </div>
  )
}

// ---------- FilterButton ----------
export const FilterButton = ({
  icon,
  children,
  onClick,
  variant = 'outline-secondary',
  active = false,
  size,
  disabled = false,
  style,
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`d-inline-flex align-items-center gap-2 text-nowrap ${active ? 'active' : ''} ${className}`}
      style={style}
    >
      {icon && <IconifyIcon icon={icon} className="fs-18" />}
      {children && <span>{children}</span>}
    </Button>
  )
}

// ---------- FilterToolbar ----------
export const FilterToolbar = ({
  children,
  actions,
  gap = 2,
  className = '',
  wrap = 'wrap',
}) => {
  return (
    <div
      className={`d-flex align-items-center gap-${gap} justify-content-between ${wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'} ${className}`}
    >
      <div
        className={`d-flex align-items-center gap-${gap} ${wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'} flex-grow-1`}
      >
        {children}
      </div>
      {actions && (
        <div className={`d-flex align-items-center gap-${gap} flex-shrink-0`}>{actions}</div>
      )}
    </div>
  )
}
