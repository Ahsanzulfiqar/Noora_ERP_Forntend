import { Row } from 'react-bootstrap'
import CompactKpiTile from '@/app/seller/components/CompactKpiTile'
import { formatCurrency, formatNumber, formatPercent } from './formatters'

const buildKpis = (d = {}) => [
  { key: 'totalRevenue', label: 'Total Revenue', value: formatCurrency(d.totalRevenue), icon: 'bx:dollar-circle', color: 'success' },
  { key: 'netProfit', label: 'Gross Profit', value: formatCurrency(d.netProfit), icon: 'bx:shield-quarter', color: 'success' },
  { key: 'totalOrders', label: 'Total Orders', value: formatNumber(d.totalOrders), icon: 'bx:shopping-bag', color: 'primary' },
  { key: 'pendingOrders', label: 'Pending Orders', value: formatNumber(d.pendingOrders), icon: 'bx:time-five', color: 'warning' },
  { key: 'deliveredOrders', label: 'Delivered Orders', value: formatNumber(d.deliveredOrders), icon: 'bx:check-circle', color: 'success' },
  { key: 'cancelledOrders', label: 'Cancelled Orders', value: formatNumber(d.cancelledOrders), icon: 'bx:x-circle', color: 'danger' },
  { key: 'returnedOrders', label: 'Returned Orders', value: formatNumber(d.returnedOrders), icon: 'bx:revision', color: 'info' },
  { key: 'codPending', label: 'COD Pending', value: formatCurrency(d.codPending), icon: 'bx:credit-card-front', color: 'warning' },
  { key: 'paidAmount', label: 'Paid Amount', value: formatCurrency(d.paidAmount), icon: 'bx:credit-card', color: 'primary' },
  { key: 'balanceAmount', label: 'Balance Amount', value: formatCurrency(d.balanceAmount), icon: 'bx:receipt', color: 'warning' },
  { key: 'averageOrder', label: 'Average Order Value', value: formatCurrency(d.averageOrderValue), icon: 'bx:line-chart', color: 'info' },
  { key: 'deliveryRate', label: 'Delivery Rate', value: formatPercent(d.deliveryRate), icon: 'bx:tachometer', color: 'success' },
]

const KpiGrid = ({ data }) => {
  const kpis = buildKpis(data || {})
  return (
    <Row className="g-2 mb-3 row-cols-2 row-cols-sm-3 row-cols-md-5">
      {kpis.map((kpi) => (
        <CompactKpiTile
          key={kpi.key}
          label={kpi.label}
          value={kpi.value}
          icon={kpi.icon}
          color={kpi.color}
        />
      ))}
    </Row>
  )
}

export default KpiGrid
