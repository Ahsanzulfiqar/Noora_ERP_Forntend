import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardTitle, Form } from 'react-bootstrap'
import { formatAmountCompact, formatCurrencyRounded } from '@/helpers/currency'

const TopProjectsChart = ({ data = [] }) => {
  const rows = Array.isArray(data) ? data : []
  const categories = rows.map((r) => r.projectName || '—')
  const values = rows.map((r) => Number(r.revenue) || 0)

  const options = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: '60%' },
    },
    colors: ['#22c55e'],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: '11px' },
        formatter: (val) => formatAmountCompact(val),
      },
    },
    yaxis: { labels: { style: { fontSize: '11px' } } },
    grid: { strokeDashArray: 3, xaxis: { lines: { show: false } } },
    tooltip: { y: { formatter: (val) => formatCurrencyRounded(val) } },
    noData: { text: 'No data', style: { color: '#9ca3af' } },
  }

  return (
    <Card className="h-100 mb-0">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <CardTitle as="h5" className="mb-0">
            Top Projects by Revenue
          </CardTitle>
          <Form.Select size="sm" style={{ width: 'auto' }}>
            <option>This Month</option>
            <option>This Week</option>
            <option>This Year</option>
          </Form.Select>
        </div>
        <ReactApexChart
          options={options}
          series={[{ name: 'Revenue', data: values }]}
          type="bar"
          height={250}
        />
      </CardBody>
    </Card>
  )
}

export default TopProjectsChart
