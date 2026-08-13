import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Form, Row, Spinner } from 'react-bootstrap'
import { FilterSelect } from '@/components/Filters'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTItle from '@/components/PageTItle'
import { useAuth } from '@/hooks/useAuth'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { useGetProjectsBySellerQuery } from '@/services/authenticateendpoint/project'
import CompactKpiTile from '../components/CompactKpiTile'
import SalesOverviewChart from '../components/SalesOverviewChart'
import OrdersStatusDonut from '../components/OrdersStatusDonut'
import RecentOrdersTable from '../components/RecentOrdersTable'
import {
  deriveSalesTrend,
  deriveStats,
  deriveTopProducts,
  deriveUnitsSold,
  filterSalesByRange,
} from '../components/deriveSellerStats'
import { formatCount, getPeriodRange, PERIODS } from '../components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'

const QUICK_ACTIONS = [
  { label: 'New Sale', icon: 'bx:plus', to: '/sales/sales-add', variant: 'primary' },
  { label: 'My Orders', icon: 'bx:receipt', to: '/seller/orders', variant: 'outline-secondary' },
  { label: 'Customers', icon: 'bx:group', to: '/seller/customers', variant: 'outline-secondary' },
  { label: 'Products', icon: 'bx:package', to: '/seller/products', variant: 'outline-secondary' },
  { label: 'Stock', icon: 'bx:cube', to: '/seller/stock', variant: 'outline-secondary' },
]

const SellerDashboardPage = () => {
  const { id: sellerId, name } = useAuth()
  const [projectId, setProjectId] = useState('')
  const [period, setPeriod] = useState('this_month')

  const { data: projects = [] } = useGetProjectsBySellerQuery(sellerId, {
    skip: !sellerId,
    refetchOnMountOrArgChange: true,
  })

  const { data: salesResponse, isLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: sellerId || '', status: '', search: '' } },
    { skip: !sellerId, refetchOnMountOrArgChange: true }
  )

  const scopedSales = useMemo(() => {
    const base = salesResponse?.data || []
    return projectId ? base.filter((s) => s.project === projectId) : base
  }, [salesResponse, projectId])

  const { from: fromIso, to: toIso } = getPeriodRange(period)

  const monthSales = useMemo(
    () => filterSalesByRange(scopedSales, fromIso, toIso),
    [scopedSales, fromIso, toIso]
  )

  const stats = useMemo(() => deriveStats(monthSales), [monthSales])
  const salesTrend = useMemo(() => deriveSalesTrend(monthSales, fromIso, toIso), [monthSales, fromIso, toIso])
  const topProducts = useMemo(() => deriveTopProducts(monthSales, 5), [monthSales])
  const unitsSold = useMemo(() => deriveUnitsSold(monthSales), [monthSales])

  const recentSales = useMemo(() => scopedSales.slice(0, 5), [scopedSales])

  const kpis = [
    {
      label: 'Total Sales',
      value: formatCurrencyRounded(stats.totalRevenue),
      icon: 'bx:dollar-circle',
      color: 'success',
      isEmpty: monthSales.length === 0,
    },
    {
      label: 'Total Orders',
      value: formatCount(stats.totalOrders),
      icon: 'bx:shopping-bag',
      color: 'primary',
      isEmpty: monthSales.length === 0,
    },
    {
      label: 'Average Order Value',
      value: formatCurrencyRounded(stats.averageOrderValue),
      icon: 'bx:line-chart',
      color: 'warning',
      isEmpty: monthSales.length === 0,
    },
    {
      label: 'Units Sold',
      value: formatCount(unitsSold),
      icon: 'bx:cube',
      color: 'info',
      isEmpty: unitsSold === 0,
    },
    {
      label: 'Pending Orders',
      value: formatCount(stats.pendingOrders),
      icon: 'bx:time-five',
      color: 'danger',
      isEmpty: monthSales.length === 0,
    },
  ]

  return (
    <>
      <PageTItle title="Seller Dashboard" />

      <Row className="mb-3 align-items-center g-3">
        <Col className="flex-grow-1">
          <h3 className="mb-0">Dashboard</h3>
          <p className="text-muted mb-0">
            Welcome back{name ? `, ${name}` : ''}!
            <span role="img" aria-label="wave" className="ms-1">👋</span>
          </p>
        </Col>
        <Col md="auto">
          <FilterSelect
            size="sm"
            style={{ minWidth: 200 }}
            value={projectId}
            onChange={(v) => setProjectId(v)}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p._id, label: p.name })),
            ]}
          />
        </Col>
      </Row>

      <Row className="g-2 mb-3 row-cols-2 row-cols-sm-3 row-cols-md-5">
        {kpis.map((k) => (
          <CompactKpiTile key={k.label} {...k} />
        ))}
      </Row>

      <Row className="g-3 mb-3">
        <Col lg={5}>
          <SalesOverviewChart
            salesTrend={salesTrend}
            isLoading={isLoading}
            period={period}
            onPeriodChange={setPeriod}
            periods={PERIODS}
          />
        </Col>
        <Col lg={4}>
          <OrdersStatusDonut statusBreakdown={stats.statusBreakdown} isLoading={isLoading} />
        </Col>
        <Col lg={3}>
          <Card className="h-100 mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Quick Actions</h5>
            </CardHeader>
            <CardBody className="d-flex flex-column gap-2">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className={`btn btn-${a.variant} d-flex align-items-center justify-content-center gap-2`}
                >
                  <IconifyIcon icon={a.icon} className="fs-18" />
                  {a.label}
                </Link>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={5}>
          <RecentOrdersTable sales={recentSales} isLoading={isLoading} />
        </Col>
        <Col lg={4}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top Selling Products</h5>
                <Link to="/seller/products" className="text-dark fw-semibold fs-13">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <div className="p-3 d-flex flex-column gap-3" style={{ overflow: 'hidden' }}>
                  {topProducts.map((p) => (
                    <div
                      key={p.product || p.sku || p.productName}
                      className="d-flex align-items-center gap-2"
                      style={{ minWidth: 0 }}
                    >
                      <div
                        className="rounded bg-soft-success flex-centered flex-shrink-0"
                        style={{ width: 36, height: 36 }}
                      >
                        <IconifyIcon icon="bx:package" className="fs-18 text-success" />
                      </div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ minWidth: 0 }}
                        >
                          <div
                            className="fw-semibold text-truncate flex-grow-1"
                            style={{ minWidth: 0 }}
                            title={p.productName || p.sku || 'Product'}
                          >
                            {p.productName || p.sku || 'Product'}
                          </div>
                          <div className="fw-semibold text-dark text-nowrap flex-shrink-0">
                            {formatCurrencyRounded(p.revenue)}
                          </div>
                        </div>
                        <small className="text-muted">{formatCount(p.quantity)} units</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="mb-3">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Stock Alert</h5>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-3">No data</div>
            </CardBody>
          </Card>

          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Notifications</h5>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-3">No data</div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SellerDashboardPage
