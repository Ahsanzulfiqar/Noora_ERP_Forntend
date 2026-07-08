import { Card, CardBody, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { formatCurrency, formatNumber, formatPercent } from './formatters'

const buildKpis = (d = {}) => [
  { key: 'totalRevenue', label: 'Total Revenue', amount: formatCurrency(d.totalRevenue), icon: 'bx:dollar-circle', color: 'success' },
  { key: 'netProfit', label: 'Gross Profit', amount: formatCurrency(d.netProfit), icon: 'bx:shield-quarter', color: 'success' },
  { key: 'totalOrders', label: 'Total Orders', amount: formatNumber(d.totalOrders), icon: 'bx:shopping-bag', color: 'primary' },
  { key: 'pendingOrders', label: 'Pending Orders', amount: formatNumber(d.pendingOrders), icon: 'bx:time-five', color: 'warning' },
  { key: 'deliveredOrders', label: 'Delivered Orders', amount: formatNumber(d.deliveredOrders), icon: 'bx:check-circle', color: 'success' },
  { key: 'cancelledOrders', label: 'Cancelled Orders', amount: formatNumber(d.cancelledOrders), icon: 'bx:x-circle', color: 'danger' },
  { key: 'returnedOrders', label: 'Returned Orders', amount: formatNumber(d.returnedOrders), icon: 'bx:revision', color: 'info' },
  { key: 'codPending', label: 'COD Pending', amount: formatCurrency(d.codPending), icon: 'bx:credit-card-front', color: 'warning' },
  { key: 'paidAmount', label: 'Paid Amount', amount: formatCurrency(d.paidAmount), icon: 'bx:credit-card', color: 'primary' },
  { key: 'balanceAmount', label: 'Balance Amount', amount: formatCurrency(d.balanceAmount), icon: 'bx:receipt', color: 'warning' },
  { key: 'averageOrder', label: 'Average Order Value', amount: formatCurrency(d.averageOrderValue), icon: 'bx:line-chart', color: 'info' },
  { key: 'deliveryRate', label: 'Delivery Rate', amount: formatPercent(d.deliveryRate), icon: 'bx:tachometer', color: 'success' },
]

const KpiCard = ({ label, amount, icon, color }) => (
  <Col md={6} lg={3} className="mb-3">
    <Card className="h-100 mb-0">
      <CardBody>
        <div className="d-flex align-items-center gap-3">
          <div
            className={`avatar-md rounded-circle bg-soft-${color} flex-centered flex-shrink-0`}
            style={{ width: 48, height: 48 }}
          >
            <IconifyIcon icon={icon} className={`fs-24 text-${color}`} />
          </div>
          <div className="flex-grow-1">
            <p className="text-muted mb-1 small">{label}</p>
            <h4 className="text-dark mb-0">{amount}</h4>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
)

const KpiGrid = ({ data }) => {
  const kpis = buildKpis(data || {})
  return (
    <Row>
      {kpis.map((kpi) => (
        <KpiCard key={kpi.key} {...kpi} />
      ))}
    </Row>
  )
}

export default KpiGrid
