import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Form, Row, Spinner } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTItle from '@/components/PageTItle'
import { useAuth } from '@/hooks/useAuth'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { useGetProjectsBySellerQuery } from '@/services/authenticateendpoint/project'
import CompactKpiTile from '../components/CompactKpiTile'
import { FilterSelect, FilterDateRange, FilterClearAll } from '@/components/Filters'
import SalesOverviewChart from '../components/SalesOverviewChart'
import OrdersStatusDonut from '../components/OrdersStatusDonut'
import RecentOrdersTable from '../components/RecentOrdersTable'
import {
  deriveSalesTrend,
  deriveStats,
  deriveTopCustomers,
  deriveUnitsSold,
  filterSalesByRange,
} from '../components/deriveSellerStats'
import {
  endOfMonth,
  formatCount,
  getPeriodRange,
  getPreviousPeriodRange,
  PERIODS,
  startOfMonth,
  toIsoDate,
} from '../components/formatters'
import { formatAmountCompact, formatCurrencyRounded } from '@/helpers/currency'

const pctChange = (curr, prev) => {
  const c = Number(curr) || 0
  const p = Number(prev) || 0
  if (p === 0) return c > 0 ? 100 : 0
  return ((c - p) / p) * 100
}

const groupByWeek = (points = []) => {
  const revenues = [0, 0, 0, 0, 0]
  points.forEach((p) => {
    const d = new Date(p.date)
    if (Number.isNaN(d.getTime())) return
    const dow = d.getDate()
    const idx = Math.min(4, Math.floor((dow - 1) / 7))
    revenues[idx] += Number(p.revenue) || 0
  })
  return revenues
}

const rangeLength = (fromIso, toIso) => {
  if (!fromIso || !toIso) return 0
  return Math.max(1, Math.round((new Date(toIso) - new Date(fromIso)) / (24 * 3600 * 1000)) + 1)
}

const shiftBack = (fromIso, days) => {
  const d = new Date(fromIso)
  d.setDate(d.getDate() - days)
  return d
}

const SellerPerformancePage = () => {
  const { id: sellerId } = useAuth()

  const [projectId, setProjectId] = useState('')
  const [dateFrom, setDateFrom] = useState(toIsoDate(startOfMonth()))
  const [dateTo, setDateTo] = useState(toIsoDate(endOfMonth()))
  const [overviewPeriod, setOverviewPeriod] = useState('this_month')
  const [comparePeriod, setComparePeriod] = useState('this_month')

  const { data: projects = [] } = useGetProjectsBySellerQuery(sellerId, {
    skip: !sellerId,
    refetchOnMountOrArgChange: true,
  })

  const { data: salesResponse, isLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: sellerId || '', status: '', search: '' } },
    { skip: !sellerId, refetchOnMountOrArgChange: true }
  )

  const scopedSales = useMemo(() => {
    const rows = salesResponse?.data || []
    return projectId ? rows.filter((s) => s.project === projectId) : rows
  }, [salesResponse, projectId])

  const currFrom = dateFrom || toIsoDate(startOfMonth())
  const currTo = dateTo || toIsoDate(endOfMonth())

  const days = rangeLength(currFrom, currTo)
  const prevFromDate = shiftBack(currFrom, days)
  const prevToDate = shiftBack(currTo, days)
  const prevFrom = toIsoDate(prevFromDate)
  const prevTo = toIsoDate(prevToDate)

  const currSales = useMemo(
    () => filterSalesByRange(scopedSales, currFrom, currTo),
    [scopedSales, currFrom, currTo]
  )
  const prevSales = useMemo(
    () => filterSalesByRange(scopedSales, prevFrom, prevTo),
    [scopedSales, prevFrom, prevTo]
  )

  const curr = useMemo(() => deriveStats(currSales), [currSales])
  const prev = useMemo(() => deriveStats(prevSales), [prevSales])

  const overviewRange = useMemo(() => getPeriodRange(overviewPeriod), [overviewPeriod])
  const overviewSales = useMemo(
    () => filterSalesByRange(scopedSales, overviewRange.from, overviewRange.to),
    [scopedSales, overviewRange]
  )
  const currTrend = useMemo(
    () => deriveSalesTrend(overviewSales, overviewRange.from, overviewRange.to),
    [overviewSales, overviewRange]
  )

  const compareRange = useMemo(() => getPeriodRange(comparePeriod), [comparePeriod])
  const comparePrev = useMemo(
    () => getPreviousPeriodRange(compareRange.from, compareRange.to),
    [compareRange]
  )
  const compareCurrSales = useMemo(
    () => filterSalesByRange(scopedSales, compareRange.from, compareRange.to),
    [scopedSales, compareRange]
  )
  const comparePrevSales = useMemo(
    () => filterSalesByRange(scopedSales, comparePrev.from, comparePrev.to),
    [scopedSales, comparePrev]
  )
  const compareCurr = useMemo(() => deriveStats(compareCurrSales), [compareCurrSales])
  const comparePrevStats = useMemo(() => deriveStats(comparePrevSales), [comparePrevSales])

  const topCustomers = useMemo(() => deriveTopCustomers(scopedSales, 5), [scopedSales])
  const unitsCurr = useMemo(() => deriveUnitsSold(currSales), [currSales])
  const unitsPrev = useMemo(() => deriveUnitsSold(prevSales), [prevSales])

  const kpis = [
    {
      label: 'Total Sales',
      value: formatCurrencyRounded(curr.totalRevenue),
      icon: 'bx:dollar-circle',
      color: 'success',
      delta: pctChange(curr.totalRevenue, prev.totalRevenue),
      deltaLabel: 'vs last month',
      isEmpty: currSales.length === 0,
    },
    {
      label: 'Total Orders',
      value: formatCount(curr.totalOrders),
      icon: 'bx:shopping-bag',
      color: 'primary',
      delta: pctChange(curr.totalOrders, prev.totalOrders),
      deltaLabel: 'vs last month',
      isEmpty: currSales.length === 0,
    },
    {
      label: 'Average Order Value',
      value: formatCurrencyRounded(curr.averageOrderValue),
      icon: 'bx:line-chart',
      color: 'warning',
      delta: pctChange(curr.averageOrderValue, prev.averageOrderValue),
      deltaLabel: 'vs last month',
      isEmpty: currSales.length === 0,
    },
    {
      label: 'Units Sold',
      value: formatCount(unitsCurr),
      icon: 'bx:cube',
      color: 'info',
      delta: pctChange(unitsCurr, unitsPrev),
      deltaLabel: 'vs last month',
      isEmpty: unitsCurr === 0,
    },
    {
      label: 'Pending Orders',
      value: formatCount(curr.pendingOrders),
      icon: 'bx:time-five',
      color: 'danger',
      delta: pctChange(curr.pendingOrders, prev.pendingOrders),
      deltaLabel: 'vs last month',
      isEmpty: currSales.length === 0,
    },
  ]

  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
  const compareCurrTrend = useMemo(
    () => deriveSalesTrend(compareCurrSales, compareRange.from, compareRange.to),
    [compareCurrSales, compareRange]
  )
  const comparePrevTrend = useMemo(
    () => deriveSalesTrend(comparePrevSales, comparePrev.from, comparePrev.to),
    [comparePrevSales, comparePrev]
  )
  const currWeeks = groupByWeek(compareCurrTrend)
  const prevWeeks = groupByWeek(comparePrevTrend)
  const hasCompareData = currWeeks.some((v) => v > 0) || prevWeeks.some((v) => v > 0)

  const compareOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    colors: ['#22c55e', '#cbd5e1'],
    xaxis: { categories: weekLabels, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: {
      labels: { formatter: (val) => formatAmountCompact(val) },
    },
    legend: { position: 'top' },
    grid: { strokeDashArray: 3 },
    tooltip: { y: { formatter: (val) => formatCurrencyRounded(val) } },
  }

  return (
    <>
      <PageTItle title="My Performance" />

      <Row className="mb-3 align-items-center g-3">
        <Col lg="auto" className="flex-grow-1">
          <h3 className="mb-0">My Performance</h3>
          <p className="text-muted mb-0">Track and analyze your sales performance</p>
        </Col>
        <Col md="auto">
          <FilterSelect
            inline
            label="Project"
            size="sm"
            value={projectId}
            onChange={setProjectId}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p._id, label: p.name })),
            ]}
            style={{ minWidth: 180 }}
          />
        </Col>
        <Col md="auto">
          <FilterDateRange
            size="sm"
            from={dateFrom || ''}
            to={dateTo || ''}
            onChange={({ from, to }) => {
              setDateFrom(from)
              setDateTo(to)
            }}
            style={{ width: 240 }}
          />
        </Col>
        <Col md="auto">
          <FilterClearAll
            size="sm"
            onClear={() => {
              setProjectId('')
              setDateFrom('')
              setDateTo('')
              setOverviewPeriod('this_month')
              setComparePeriod('this_month')
            }}
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
            salesTrend={currTrend}
            isLoading={isLoading}
            period={overviewPeriod}
            onPeriodChange={setOverviewPeriod}
            periods={PERIODS}
          />
        </Col>
        <Col lg={4}>
          <OrdersStatusDonut
            statusBreakdown={curr.statusBreakdown}
            isLoading={isLoading}
            title="Orders Status (This Month)"
          />
        </Col>
        <Col lg={3}>
          <Card className="h-100 mb-0">
            <CardHeader className="border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top Customers</h5>
                <span className="text-dark fw-semibold fs-13">Total Sales</span>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : topCustomers.length === 0 ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {topCustomers.map((c) => (
                    <div key={c.name}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold small">{c.name}</span>
                        <span className="fw-semibold small">{formatCurrencyRounded(c.total)}</span>
                      </div>
                      <div className="progress" style={{ height: 4 }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={5}>
          <RecentOrdersTable sales={scopedSales} isLoading={isLoading} />
        </Col>
        <Col lg={4}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Sales Comparison</h5>
                <Form.Select
                  size="sm"
                  value={comparePeriod}
                  onChange={(e) => setComparePeriod(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  {PERIODS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : !hasCompareData ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="text-dark fw-bold fs-18">{formatCurrencyRounded(compareCurr.totalRevenue)}</div>
                      <small className="text-muted">Current</small>
                    </div>
                    <div className="text-center">
                      <IconifyIcon
                        icon={
                          compareCurr.totalRevenue >= comparePrevStats.totalRevenue
                            ? 'bx:trending-up'
                            : 'bx:trending-down'
                        }
                        className={`fs-24 ${compareCurr.totalRevenue >= comparePrevStats.totalRevenue ? 'text-success' : 'text-danger'}`}
                      />
                      <div
                        className={`small fw-semibold ${compareCurr.totalRevenue >= comparePrevStats.totalRevenue ? 'text-success' : 'text-danger'}`}
                      >
                        {Math.abs(pctChange(compareCurr.totalRevenue, comparePrevStats.totalRevenue)).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted fw-bold fs-18">{formatCurrencyRounded(comparePrevStats.totalRevenue)}</div>
                      <small className="text-muted">Previous</small>
                    </div>
                  </div>
                  <ReactApexChart
                    options={compareOptions}
                    series={[
                      { name: 'Current', data: currWeeks },
                      { name: 'Previous', data: prevWeeks },
                    ]}
                    type="bar"
                    height={220}
                  />
                </>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="mb-3">
            <CardHeader className="border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Payment Summary</h5>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : currSales.length === 0 ? (
                <div className="text-center text-muted py-3">No data</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="d-flex align-items-center gap-2">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />{' '}
                      Paid Amount
                    </span>
                    <span className="fw-semibold">{formatCurrencyRounded(curr.paidAmount)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="d-flex align-items-center gap-2">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />{' '}
                      COD Pending
                    </span>
                    <span className="fw-semibold">{formatCurrencyRounded(curr.codPending)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="d-flex align-items-center gap-2">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />{' '}
                      Balance
                    </span>
                    <span className="fw-semibold">{formatCurrencyRounded(curr.balanceAmount)}</span>
                  </div>
                  <div className="border-top mt-2 pt-2 d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold text-dark">{formatCurrencyRounded(curr.totalRevenue)}</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Achievements</h5>
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

export default SellerPerformancePage
