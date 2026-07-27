import { Card, CardBody, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const SellerKpiCard = ({ label, value, icon, color = 'success', delta, deltaLabel, isEmpty }) => {
  const isPositive = typeof delta === 'number' ? delta >= 0 : null
  return (
    <Col>
      <Card className="h-100 mb-0">
        <CardBody className="d-flex align-items-center gap-2 p-2">
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
              <div className="text-muted" style={{ fontSize: 12 }}>No data</div>
            ) : (
              <>
                <div className="fw-bold text-dark text-truncate" style={{ fontSize: 14 }}>{value}</div>
                {typeof delta === 'number' && (
                  <small className={isPositive ? 'text-success' : 'text-danger'} style={{ fontSize: 10 }}>
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

export default SellerKpiCard
