import { Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const NoDataText = () => (
  <div className="text-center text-muted py-4">No data</div>
)

const SellerCardShell = ({
  title,
  subtitle,
  action,
  actionTo,
  isLoading,
  isEmpty,
  emptyText = 'No data',
  bodyClassName = '',
  headerClassName = 'border-bottom',
  className = 'mb-3',
  children,
}) => {
  return (
    <Card className={className}>
      {(title || action) && (
        <CardHeader className={headerClassName}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {title && <h5 className="mb-0">{title}</h5>}
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
            {action && actionTo && (
              <Link to={actionTo} className="text-dark fw-semibold fs-13">
                {action}
              </Link>
            )}
            {action && !actionTo && (
              <span className="text-dark fw-semibold fs-13">{action}</span>
            )}
          </div>
        </CardHeader>
      )}
      <CardBody className={bodyClassName}>
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        ) : isEmpty ? (
          <div className="text-center text-muted py-4">{emptyText}</div>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  )
}

export default SellerCardShell
