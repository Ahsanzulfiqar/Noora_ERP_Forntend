import { useMemo } from 'react'
import { Button, Form } from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import IconifyIcon from '@/components/wrappers/IconifyIcon'


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
const pad = (n) => String(n).padStart(2, '0')

// Local-time ISO date (YYYY-MM-DD). Deliberately not Date#toISOString(), which
// converts to UTC and can shift the day by one either side of midnight.
const toIso = (d) =>
  d instanceof Date && !Number.isNaN(d.getTime())
    ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    : ''

// Parse YYYY-MM-DD as a *local* date. `new Date('2026-07-01')` is parsed as UTC
// midnight, which lands on the previous day in negative-offset timezones.
const fromIso = (v) => {
  if (!v) return null
  const [y, m, d] = String(v).split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}


export const FilterDateRange = ({
  from = '',
  to = '',
  onChange,
  label,
  placeholder = 'Select date range',
  size,
  disabled = false,
  minDate,
  maxDate,
  months = 1,
  style,
  className = '',
  inline = false,
}) => {
  const selected = useMemo(() => {
    const dates = [fromIso(from), fromIso(to)].filter(Boolean)
    return dates.length ? dates : null
  }, [from, to])
  const hasValue = Boolean(from || to)
  const height = size === 'sm' ? 32 : 40
  const iconTop = size === 'sm' ? 7 : 11

  const commit = (dates) => {
    if (!dates?.length) return onChange?.({ from: '', to: '' })
    const start = toIso(dates[0])
    const end = dates.length > 1 ? toIso(dates[1]) : start
    return onChange?.({ from: start, to: end })
  }

  const picker = (
    <div className="position-relative" style={style}>
      <IconifyIcon
        icon="bx:calendar"
        className="position-absolute"
        style={{ top: iconTop, left: 10, color: '#9ca3af', pointerEvents: 'none', zIndex: 3 }}
      />
      <Flatpickr
        className="form-control"
        value={selected}
        placeholder={placeholder}
        disabled={disabled}
        options={{
          mode: 'range',
          dateFormat: 'd/m/Y',
          showMonths: months,
          minDate,
          maxDate,
          // rangeSeparator lives on the locale (self.l10n.rangeSeparator), not at the
          // top level — setting it in options is silently ignored. Partial locale
          // objects are merged over the defaults, so this only overrides the separator.
          locale: { rangeSeparator: ' → ' },
        }}
        // Fires with 1 date on the first click, 2 on the second.
        onChange={(dates) => {
          if (dates.length === 2) commit(dates)
        }}
        // Closing after a single click means the user wants that one day.
        onClose={(dates) => {
          if (dates.length === 1) commit(dates)
        }}
        // No background override here — .form-control follows data-bs-theme, and
        // hardcoding one would render a white input in dark mode.
        style={{
          width: '100%',
          height,
          paddingLeft: 32,
          paddingRight: hasValue && !disabled ? 30 : 12,
        }}
      />
      {hasValue && !disabled && (
        <Button
          variant="link"
          className="position-absolute p-0 text-muted d-flex align-items-center"
          style={{ top: 0, right: 8, height, zIndex: 3 }}
          onClick={() => commit([])}
          title="Clear date range"
          aria-label="Clear date range"
        >
          <IconifyIcon icon="bx:x" className="fs-18" />
        </Button>
      )}
    </div>
  )

  if (inline) {
    return (
      <div className={`d-flex align-items-center gap-2 ${className}`}>
        {label && <Form.Label className="mb-0 text-nowrap">{label}:</Form.Label>}
        {picker}
      </div>
    )
  }
  return (
    <div className={className}>
      {label && <Form.Label className="text-muted small mb-1">{label}</Form.Label>}
      {picker}
    </div>
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
export const FilterClearAll = ({
  onClear,
  children = 'Clear All',
  icon = 'bx:x',
  variant = 'light',
  size,
  disabled = false,
  style,
  className = '',
}) => (
  <FilterButton
    icon={icon}
    variant={variant}
    size={size}
    onClick={onClear}
    disabled={disabled}
    style={{ height: size === 'sm' ? 32 : 40, ...style }}
    className={className}
  >
    {children}
  </FilterButton>
)

// ---------- FilterToolbar ----------
export const FilterToolbar = ({
  children,
  actions,
  onClear,
  clearLabel,
  gap = 2,
  className = '',
  wrap = 'wrap',
}) => {
  // A toolbar given onClear renders the shared Clear All itself, so pages never
  // repeat the markup. Explicit `actions` still render alongside it.
  const hasActions = Boolean(actions) || Boolean(onClear)
  return (
    <div
      className={`d-flex align-items-center gap-${gap} justify-content-between ${wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'} ${className}`}
    >
      <div
        className={`d-flex align-items-center gap-${gap} ${wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'} flex-grow-1`}
      >
        {children}
      </div>
      {hasActions && (
        <div className={`d-flex align-items-center gap-${gap} flex-shrink-0`}>
          {actions}
          {onClear && <FilterClearAll onClear={onClear}>{clearLabel}</FilterClearAll>}
        </div>
      )}
    </div>
  )
}
