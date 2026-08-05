import { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Modal, Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import SaleStatusChip from '@/components/SaleStatusChip'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import {
  useGetSalesQuery,
  useMarkDeliveredMutation,
} from '@/services/authenticateendpoint/sales'
import { formatCount } from '@/app/seller/components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const isOutForDelivery = (s) => {
  const st = (s.status || '').toLowerCase()
  return st === 'shipped' || st === 'out_for_delivery'
}

const WarehouseDeliveryOrdersPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [confirmSaleId, setConfirmSaleId] = useState(null)

  const { data: salesResponse, isLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: '', status: '', search: '' } },
    { refetchOnMountOrArgChange: true }
  )
  const [markDelivered, { isLoading: isMarking, error: markError }] = useMarkDeliveredMutation()

  useEffect(() => {
    if (markError) toast.error(extractApiErrorMessage(markError))
  }, [markError])

  const rows = salesResponse?.data || []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const scoped = rows.filter((s) => s.warehouse === warehouseId && isOutForDelivery(s))
    if (!q) return scoped
    return scoped.filter(
      (s) =>
        s.invoiceNo?.toLowerCase().includes(q) ||
        s.customerName?.toLowerCase().includes(q) ||
        s.courier?.trackingNo?.toLowerCase().includes(q)
    )
  }, [rows, warehouseId, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  const handleConfirmDelivered = async () => {
    if (!confirmSaleId) return
    try {
      await markDelivered(confirmSaleId).unwrap()
      toast.success('Order marked as delivered')
      setConfirmSaleId(null)
    } catch (err) {
      // toast shown by effect
    }
  }

  return (
    <>
      <WarehousePageHeader
        title="Delivery Orders"
        subtitle="Orders currently out for delivery"
      />

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <FilterToolbar
            onClear={() => {
              setSearch('')
              setPage(1)
            }}
          >
            <FilterSearch
              value={search}
              onChange={setSearch}
              placeholder="Search invoice, customer or tracking..."
              className="flex-grow-1"
              style={{ minWidth: 240 }}
            />
          </FilterToolbar>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="ps-3">Invoice</th>
                  <th>Customer</th>
                  <th>Courier</th>
                  <th>Tracking No</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-center pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                    </td>
                  </tr>
                ) : !warehouseId ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted p-5">
                      Select a warehouse to view delivery queue
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  paged.map((s) => (
                    <tr key={s._id}>
                      <td className="ps-3 fw-semibold">
                        <Link to={`/sales/sales-detail/${s._id}`} className="text-dark">
                          {s.invoiceNo || '-'}
                        </Link>
                      </td>
                      <td>
                        <div>{s.customerName || '—'}</div>
                        {s.customerPhone ? (
                          <small className="text-muted">{s.customerPhone}</small>
                        ) : null}
                      </td>
                      <td>{s.courier?.courierName || '—'}</td>
                      <td>{s.courier?.trackingNo || '—'}</td>
                      <td>{formatCount((s.items || []).length)}</td>
                      <td className="fw-semibold">{formatCurrencyRounded(s.totalAmount)}</td>
                      <td>
                        <SaleStatusChip status={s.status || 'draft'} />
                      </td>
                      <td className="text-center pe-3">
                        <Button
                          size="sm"
                          variant="success"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => setConfirmSaleId(s._id)}
                        >
                          <IconifyIcon icon="bx:check-circle" className="fs-16" />
                          Mark Delivered
                        </Button>
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
      </Card>

      <Modal
        show={!!confirmSaleId}
        onHide={() => setConfirmSaleId(null)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure this order has been delivered to the customer?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmSaleId(null)} disabled={isMarking}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmDelivered} disabled={isMarking}>
            {isMarking ? 'Marking...' : 'Yes, Mark Delivered'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default WarehouseDeliveryOrdersPage
