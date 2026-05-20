import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardTitle } from 'react-bootstrap'

const STATUS_COLOR = {
  delivered: '#22c55e',
  pending: '#f59e0b',
  draft: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#3b82f6',
  out_for_delivery: '#3b82f6',
  cancelled: '#ef4444',
  returned: '#a855f7',
}

const prettyLabel = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const SalesByStatusDonut = ({ data = [] }) => {
  const rows = Array.isArray(data) ? data : []
  const labels = rows.map((r) => prettyLabel(r.status))
  const series = rows.map((r) => Number(r.orders) || 0)
  const colors = rows.map((r) => STATUS_COLOR[(r.status || '').toLowerCase()] || '#9ca3af')
  const total = series.reduce((a, b) => a + b, 0)

  const options = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels,
    colors,
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', offsetY: 20, color: '#6c757d' },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 600,
              offsetY: -18,
              formatter: () => total.toLocaleString(),
            },
            total: { show: true, label: 'Total', formatter: () => total.toLocaleString() },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val) => val.toLocaleString() } },
    noData: { text: 'No data', style: { color: '#9ca3af' } },
  }

  return (
    <Card className="h-100 mb-0">
      <CardBody>
        <CardTitle as="h5" className="mb-2">
          Sales by Status
        </CardTitle>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div style={{ width: 170 }}>
            <ReactApexChart options={options} series={series} type="donut" height={200} />
          </div>
          <div className="flex-grow-1">
            {rows.length === 0 ? (
              <p className="text-muted small mb-0">No data</p>
            ) : (
              rows.map((row, i) => {
                const pct = total > 0 ? ((series[i] / total) * 100).toFixed(1) : '0.0'
                return (
                  <div key={`${row.status}-${i}`} className="d-flex align-items-center justify-content-between mb-2">
                    <span className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: colors[i],
                          display: 'inline-block',
                        }}
                      />
                      <span className="small">{labels[i]}</span>
                    </span>
                    <span className="small text-muted">
                      {series[i].toLocaleString()} ({pct}%)
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default SalesByStatusDonut
