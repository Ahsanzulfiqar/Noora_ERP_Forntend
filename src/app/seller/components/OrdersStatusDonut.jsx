import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import { prettyLabel } from './formatters'

const STATUS_COLOR = {
  delivered: '#22c55e',
  confirmed: '#3b82f6',
  packed: '#f59e0b',
  shipped: '#8b5cf6',
  cancelled: '#ef4444',
  returned: '#a855f7',
  pending: '#f59e0b',
  draft: '#f59e0b',
  out_for_delivery: '#3b82f6',
}

const OrdersStatusDonut = ({ statusBreakdown = [], title = 'Orders Status', isLoading }) => {
  const rows = Array.isArray(statusBreakdown) ? statusBreakdown.filter((r) => Number(r.orders) > 0) : []
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
          size: '75%',
          labels: {
            show: true,
            name: { show: true, fontSize: '13px', offsetY: 20, color: '#6c757d', formatter: () => 'Total' },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              offsetY: -14,
              formatter: () => total.toLocaleString(),
            },
            total: { show: true, label: 'Total', formatter: () => total.toLocaleString() },
          },
        },
      },
    },
    tooltip: { y: { formatter: (v) => v.toLocaleString() } },
  }

  return (
    <Card className="h-100 mb-0">
      <CardHeader className="border-bottom">
        <h5 className="mb-0">{title}</h5>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center text-muted py-4">No data</div>
        ) : (
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div style={{ width: 180 }}>
              <ReactApexChart options={options} series={series} type="donut" height={200} />
            </div>
            <div className="flex-grow-1">
              {rows.map((row, i) => {
                const pct = total > 0 ? ((series[i] / total) * 100).toFixed(1) : '0.0'
                return (
                  <div
                    key={`${row.status}-${i}`}
                    className="d-flex align-items-center justify-content-between mb-2"
                  >
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
              })}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default OrdersStatusDonut
