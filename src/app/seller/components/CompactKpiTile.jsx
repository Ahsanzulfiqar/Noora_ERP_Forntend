import { Card, CardBody, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

/**
 * CompactKpiTile — small stat / status tile used across seller pages.
 * Supports two modes:
 *   - Metric card (label + value)      e.g. Total Sales, Total Orders
 *   - Clickable filter tab (label + count + active border) e.g. Orders status tabs
 *
 * Props:
 *   label       string   — text under the icon
 *   value       any      — number or formatted string shown as the main value
 *   icon        string   — iconify icon name
 *   color       string   — bootstrap color token (success | primary | secondary | ...)
 *   onClick     func     — makes the tile clickable
 *   active      bool     — shows a colored border when true (for tab-style tiles)
 *   isEmpty     bool     — renders "No data" instead of value
 *   delta       number   — optional +/-% badge under the value
 *   deltaLabel  string   — text after the delta number
 */
const CompactKpiTile = ({
  label,
  value,
  icon,
  color = 'primary',
  onClick,
  active = false,
  isEmpty = false,
  delta,
  deltaLabel,
  sub,
}) => {
  const isPositive = typeof delta === 'number' ? delta >= 0 : null
  return (
    <Col className="d-flex">
      <Card
        className={`mb-0 w-100 ${active ? `border border-${color} shadow-sm` : ''}`}
        style={{ minHeight: 72, ...(onClick ? { cursor: 'pointer' } : {}) }}
        onClick={onClick}
      >
        <CardBody className="d-flex align-items-center gap-2 p-2 overflow-hidden">
          <div
            className={`rounded bg-soft-${color} flex-centered flex-shrink-0`}
            style={{ width: 28, height: 28 }}
          >
            <IconifyIcon icon={icon} className={`fs-14 text-${color}`} />
          </div>
          <div className="flex-grow-1 min-w-0">
            <div className="text-muted text-truncate" style={{ fontSize: 10, lineHeight: 1.1 }}>
              {label}
            </div>
            {isEmpty ? (
              <div className="text-muted text-truncate" style={{ fontSize: 12 }}>
                No data
              </div>
            ) : (
              <>
                <div className="fw-bold text-dark text-truncate" style={{ fontSize: 14 }}>
                  {value}
                </div>
                {sub && (
                  <div className="text-muted text-truncate" style={{ fontSize: 10, lineHeight: 1.1 }}>
                    {sub}
                  </div>
                )}
                {typeof delta === 'number' && (
                  <small
                    className={isPositive ? 'text-success' : 'text-danger'}
                    style={{ fontSize: 10 }}
                  >
                    <IconifyIcon
                      icon={isPositive ? 'bx:trending-up' : 'bx:trending-down'}
                      className="me-1"
                    />
                    {Math.abs(delta).toFixed(1)}%{deltaLabel ? ` ${deltaLabel}` : ''}
                  </small>
                )}
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

export default CompactKpiTile
