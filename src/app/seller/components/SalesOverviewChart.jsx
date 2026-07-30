import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Form, Spinner } from 'react-bootstrap'
import { formatAmountCompact, formatCurrencyRounded } from '@/helpers/currency'

const formatDate = (v) => {
  if (!v) return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const SalesOverviewChart = ({
  salesTrend = [],
  isLoading,
  title = 'Sales Overview',
  period,
  onPeriodChange,
  periods,
}) => {
  const points = Array.isArray(salesTrend) ? salesTrend : []
  const categories = points.map((p) => formatDate(p.date))
  const values = points.map((p) => Number(p.revenue) || 0)

  const options = {
    chart: { type: 'area', toolbar: { show: false }, height: 260 },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#22c55e'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    markers: {
      size: points.length <= 3 ? 6 : 0,
      colors: ['#22c55e'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px' } },
    },
    yaxis: {
      labels: {
        formatter: (val) => formatAmountCompact(val),
      },
    },
    grid: { strokeDashArray: 3, xaxis: { lines: { show: false } } },
    tooltip: {
      y: { formatter: (val) => formatCurrencyRounded(val) },
    },
  }

  return (
    <Card className="h-100 mb-0">
      <CardHeader className="border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
          {onPeriodChange && Array.isArray(periods) && periods.length > 0 && (
            <Form.Select
              size="sm"
              value={period}
              onChange={(e) => onPeriodChange(e.target.value)}
              style={{ width: 'auto' }}
            >
              {periods.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </Form.Select>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        ) : points.length === 0 ? (
          <div className="text-center text-muted py-4">No data</div>
        ) : (
          <ReactApexChart
            options={options}
            series={[{ name: 'Revenue', data: values }]}
            type="area"
            height={260}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default SalesOverviewChart
