import { Badge, Card, CardBody, CardHeader, Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getPaymentColor, prettyLabel } from './formatters'
import { formatCurrencyRounded } from '@/helpers/currency'
import SaleStatusChip from '@/components/SaleStatusChip'

const RecentOrdersTable = ({ sales = [], isLoading }) => {
  const rows = Array.isArray(sales) ? sales.slice(0, 5) : []

  return (
    <Card className="mb-3">
      <CardHeader className="border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Orders</h5>
          <Link to="/seller/orders" className="text-dark fw-semibold fs-13">
            View All Orders
          </Link>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center text-muted py-5">No data</div>
        ) : (
          <div className="table-responsive">
            <Table className="table-centered table-nowrap mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="ps-3">Order No.</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="pe-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s._id}>
                    <td className="ps-3">
                      <Link to={`/sales/sales-detail/${s._id}`} className="text-dark fw-semibold">
                        {s.invoiceNo || 'N/A'}
                      </Link>
                    </td>
                    <td>{s.customerName || <span className="text-muted">No data</span>}</td>
                    <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td className="fw-semibold">{formatCurrencyRounded(s.totalAmount)}</td>
                    <td>
                      <SaleStatusChip status={s.status || 'draft'} />
                    </td>
                    <td className="pe-3">
                      {s.payment?.status ? (
                        <Badge bg={getPaymentColor(s.payment.status)} className="text-capitalize px-2 py-1">
                          {prettyLabel(s.payment.status)}
                        </Badge>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default RecentOrdersTable
