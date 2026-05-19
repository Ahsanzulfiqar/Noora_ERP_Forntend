import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardTitle } from 'react-bootstrap'

const TopSellersChart = ({ data = [], orientation = 'horizontal' }) => {
  const horizontal = orientation === 'horizontal'
  const rows = Array.isArray(data) ? data : []
  const categories = rows.map((r) => r.sellerName || '—')
  const values = rows.map((r) => Number(r.revenue) || 0)

  const options = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal,
        borderRadius: 4,
        columnWidth: '55%',
        barHeight: '60%',
        distributed: !horizontal,
      },
    },
    colors: horizontal
      ? ['#3b82f6']
      : ['#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6'],
    dataLabels: {
      enabled: !horizontal,
      formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val),
      offsetY: -20,
      style: { fontSize: '11px', colors: ['#374151'] },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: '11px' },
        formatter: horizontal
          ? (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val)
          : undefined,
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: '11px' },
        formatter: horizontal
          ? undefined
          : (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val),
      },
    },
    grid: { strokeDashArray: 3, xaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: { y: { formatter: (val) => `AED ${val.toLocaleString()}` } },
    noData: { text: 'No data', style: { color: '#9ca3af' } },
  }

  return (
    <Card className="h-100 mb-0">
      <CardBody>
        <CardTitle as="h5" className="mb-2">
          Top Sellers by Revenue
        </CardTitle>
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

export default TopSellersChart
