import { Badge, Card, CardBody, CardHeader, Form, Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { useAuth } from '@/hooks/useAuth'
import MarkPaidModal from './MarkPaidModal'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import SaleStatusChip from '@/components/SaleStatusChip'
import { formatCurrency } from '@/helpers/currency'

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'secondary'
    case 'reserved':
      return 'info'
    case 'shipped':
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'primary'
  }
}

const isDeliveredUnpaid = (item) => {
  if (item?.status?.toLowerCase() !== 'delivered') return false
  const payStatus = item?.payment?.status?.toLowerCase()
  // Hide only if explicitly paid; show otherwise (including when payment is missing)
  return payStatus !== 'paid'
}

const getPaymentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'success'
    case 'partial':
      return 'warning'
    case 'unpaid':
      return 'danger'
    default:
      return 'secondary'
  }
}

const SalesTableExpanded = ({ filter }) => {
  const { role, id: userId } = useAuth()
  const normalizedRole = role?.toLowerCase()
  const isSeller = normalizedRole === 'seller'
  const isAdminOrManager = normalizedRole === 'admin' || normalizedRole === 'manager'

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [paySale, setPaySale] = useState(null)

  const queryFilter = {
    sellerId: isSeller ? userId : filter?.sellerId || '',
    courierId: filter?.courierId || '',
    status: filter?.status || '',
    search,
  }

  const { data: salesResponse, isLoading, error, refetch } = useGetSalesQuery(
    { page, limit, filter: queryFilter },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  const allRows = salesResponse?.data || []
  const rows = filter?.courierId
    ? allRows.filter((r) => r.courier?.courierId === filter.courierId)
    : allRows
  const total = filter?.courierId ? rows.length : salesResponse?.total || 0
  const totalPages = salesResponse?.totalPages || Math.ceil(total / limit) || 1

  const canEditSale = (status) => {
    const s = status?.toLowerCase()
    if (s === 'draft') return true
    if (s === 'confirmed') return isAdminOrManager
    return false
  }

  return (
    <Card className="mb-0">
      <CardHeader className="border-bottom">
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <h5 className="mb-0">All Sales ({total.toLocaleString()})</h5>
          <div className="d-flex gap-2 align-items-center">
            <div className="position-relative" style={{ minWidth: 260 }}>
              <IconifyIcon
                icon="bx:search"
                className="position-absolute"
                style={{ top: 9, left: 10, color: '#9ca3af' }}
              />
              <Form.Control
                type="text"
                placeholder="Search by Invoice No, Tracking..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                style={{ paddingLeft: 32 }}
              />
            </div>
            <Link to="/sales/sales-add" className="btn btn-primary btn-sm">
              <IconifyIcon icon="bx:plus" /> Add Sale
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          <Table hover className="table-centered table-nowrap mb-0">
            <thead className="bg-light text-muted" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th className="ps-3 uppercase font-weight-bold">Invoice No</th>
                <th className="uppercase font-weight-bold">Date</th>
                <th className="uppercase font-weight-bold">Courier Name</th>
                <th className="uppercase font-weight-bold">Tracking No</th>
                <th className="uppercase font-weight-bold">Status</th>
                <th className="uppercase font-weight-bold">Total Amount</th>
                <th className="uppercase font-weight-bold">Payment</th>
                <th className="text-center uppercase font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-5">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-5">
                    <IconifyIcon icon="solar:bill-list-broken" className="fs-48 text-muted mb-3" />
                    <h4>No Sales Found</h4>
                    <p className="text-muted">Start by adding your first sale.</p>
                    <Link to="/sales/sales-add" className="btn btn-primary">
                      Add New Sale
                    </Link>
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-3 fw-bold text-dark">{item.invoiceNo || 'N/A'}</td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="fw-semibold">{item.courier?.courierName || 'N/A'}</td>
                    <td>{item.courier?.trackingNo || 'N/A'}</td>
                    <td>
                      <SaleStatusChip status={item.status || 'draft'} />
                    </td>
                    <td className="fw-bold text-dark">{formatCurrency(item.totalAmount)}</td>
                    <td>
                      {item.payment ? (
                        <div className="d-flex align-items-center gap-1">
                          <Badge
                            bg={getPaymentStatusColor(item.payment.status)}
                            className="text-capitalize px-2 py-1"
                          >
                            {item.payment.status || 'N/A'}
                          </Badge>
                          {item.payment.mode && (
                            <small className="text-muted">{item.payment.mode}</small>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="hstack gap-2 justify-content-center">
                        <Link
                          to={`/sales/sales-detail/${item._id}`}
                          className="btn btn-outline-primary btn-sm rounded-circle p-1 border-0 shadow-none"
                        >
                          <IconifyIcon icon="solar:eye-broken" className="fs-18" />
                        </Link>
                        {canEditSale(item.status) ? (
                          <Link
                            to={`/sales/sales-edit/${item._id}`}
                            className="btn btn-outline-info btn-sm rounded-circle p-1 border-0 shadow-none"
                          >
                            <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                          </Link>
                        ) : (
                          <button
                            className="btn btn-outline-info btn-sm rounded-circle p-1 border-0 shadow-none"
                            disabled
                            style={{ cursor: 'not-allowed', opacity: 0.6 }}
                          >
                            <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                          </button>
                        )}
                        {isDeliveredUnpaid(item) && (
                          <SaleStatusChip status="mark_paid" onClick={() => setPaySale(item)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
        <CustomTablePaginations
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </CardBody>
      {paySale && (
        <MarkPaidModal
          show={!!paySale}
          onHide={() => setPaySale(null)}
          sale={paySale}
        />
      )}
    </Card>
  )
}

export default SalesTableExpanded
