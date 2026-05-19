import { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardTitle, Form } from 'react-bootstrap'

const formatDateLabel = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const SalesTrendChart = ({ data = [] }) => {
  const [metric, setMetric] = useState('revenue')

  const points = Array.isArray(data) ? data : []
  const categories = points.map((p) => formatDateLabel(p.date))
  const values = points.map((p) => Number(p[metric]) || 0)

  const options = {
    chart: { type: 'line', toolbar: { show: false }, height: 250 },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px' } },
    },
    yaxis: {
      labels: {
        formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val),
      },
    },
    grid: { strokeDashArray: 3, xaxis: { lines: { show: false } } },
    tooltip: {
      y: {
        formatter: (val) =>
          metric === 'revenue' ? `AED ${val.toLocaleString()}` : val.toLocaleString(),
      },
    },
    noData: { text: 'No data', style: { color: '#9ca3af' } },
  }

  return (
    <Card className="h-100 mb-0">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <CardTitle as="h5" className="mb-0">
            Sales Trend (Daily)
          </CardTitle>
          <Form.Select
            size="sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
          </Form.Select>
        </div>
        <ReactApexChart
          options={options}
          series={[{ name: metric, data: values }]}
          type="line"
          height={250}
        />
      </CardBody>
    </Card>
  )
}

export default SalesTrendChart
