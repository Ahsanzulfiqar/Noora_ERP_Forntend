import IconifyIcon from '@/components/wrappers/IconifyIcon'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardFooter, CardTitle, Col, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetAdminDashboardQuery } from '@/services/authenticateendpoint/dashboard'
import { useAuth } from '@/hooks/useAuth'

const DUMMY_STATS = {
  revenue: 0,
  netProfit: 0,
  stockValue: 0,
  purchases: 0,
  receivables: 0,
  payables: 0,
}

const formatAmount = (val) => {
  if (val == null) return '—'
  if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}k`
  return `$${val.toLocaleString()}`
}

const StatsCard = ({ amount, icon, name }) => (
  <Col md={6}>
    <Card className="overflow-hidden">
      <CardBody>
        <Row>
          <Col xs={6}>
            <div className="avatar-md bg-soft-primary rounded flex-centered">
              <IconifyIcon icon={icon} className="fs-24 text-primary" />
            </div>
          </Col>
          <Col xs={6} className="text-end">
            <p className="text-muted mb-0 text-truncate">{name}</p>
            <h3 className="text-dark mt-1 mb-0">{amount}</h3>
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="py-2 bg-light bg-opacity-50">
        <div className="d-flex align-items-center justify-content-end">
          <Link to="#!" className="text-reset fw-semibold fs-12">
            View More
          </Link>
        </div>
      </CardFooter>
    </Card>
  </Col>
)

const Stats = ({ from, to, warehouseIds }) => {
  const { role } = useAuth()
  const isAdmin = role?.toLowerCase() === 'admin'

  const { data: realData, isLoading } = useGetAdminDashboardQuery(
    { from, to, warehouseIds },
    { refetchOnMountOrArgChange: true, skip: !isAdmin }
  )

  const data = isAdmin ? realData : DUMMY_STATS

  const statItems = [
    { name: 'Revenue', icon: 'bx:trending-up', amount: formatAmount(data?.revenue) },
    { name: 'Net Profit', icon: 'bx:dollar-circle', amount: formatAmount(data?.netProfit) },
    { name: 'Stock Value', icon: 'bx:package', amount: formatAmount(data?.stockValue) },
    { name: 'Purchases', icon: 'bx:cart', amount: formatAmount(data?.purchases) },
    { name: 'Receivables', icon: 'bx:money', amount: formatAmount(data?.receivables) },
    { name: 'Payables', icon: 'bx:credit-card', amount: formatAmount(data?.payables) },
  ]

  const chartCategories = ['Revenue', 'Net Profit', 'Stock Value', 'Purchases', 'Receivables', 'Payables']
  const realValues = [
    data?.revenue ?? 0,
    data?.netProfit ?? 0,
    data?.stockValue ?? 0,
    data?.purchases ?? 0,
    data?.receivables ?? 0,
    data?.payables ?? 0,
  ]
  const maxVal = Math.max(...realValues)
  const minDisplay = maxVal > 0 ? maxVal * 0.04 : 10
  const displayValues = realValues.map((v) => (v === 0 ? minDisplay : v))

  const fmtTooltip = (val, { dataPointIndex }) => {
    const real = realValues[dataPointIndex]
    if (real >= 1000000) return `$${(real / 1000000).toFixed(2)}M`
    if (real >= 1000) return `$${(real / 1000).toFixed(2)}k`
    return `$${real.toLocaleString()}`
  }

  const chartOptions = {
    series: [{ name: 'Amount ($)', data: displayValues }],
    chart: {
      height: 313,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartCategories,
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: { style: { fontSize: '12px' } },
    },
    yaxis: {
      min: 0,
      max: maxVal > 0 ? undefined : 100,
      axisBorder: { show: false },
      labels: {
        formatter: (val) => {
          if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
          if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
          return `$${val}`
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: -2, bottom: 0, left: 10 },
    },
    legend: { show: false },
    colors: ['#ff6c2f', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'],
    tooltip: { y: { formatter: fmtTooltip } },
  }

  return (
    <>
      <Col xxl={5}>
        <Row>
          {isLoading ? (
            <Col xs={12} className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </Col>
          ) : (
            statItems.map((item, idx) => <StatsCard key={idx} {...item} />)
          )}
        </Row>
      </Col>
      <Col xxl={7}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h4'}>Overview</CardTitle>
            </div>
            <div dir="ltr">
              <ReactApexChart options={chartOptions} series={chartOptions.series} height={313} type="bar" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
};
export default Stats;