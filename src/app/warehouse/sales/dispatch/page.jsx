import { useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import SaleStatusChip from '@/components/SaleStatusChip'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { formatCount, formatPKR } from '@/app/seller/components/formatters'
import OutForDeliveryModal from '@/app/admin/sales/salesId/components/modals/OutForDeliveryModal'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const isDispatchable = (s) => (s.status || '').toLowerCase() === 'confirmed'

const WarehouseDispatchOrdersPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dispatchSaleId, setDispatchSaleId] = useState(null)

  const { data: salesResponse, isLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: '', status: '', search: '' } },
    { refetchOnMountOrArgChange: true }
  )

  const rows = salesResponse?.data || []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const scoped = rows.filter((s) => s.warehouse === warehouseId && isDispatchable(s))
    if (!q) return scoped
    return scoped.filter(
      (s) =>
        s.invoiceNo?.toLowerCase().includes(q) ||
        s.customerName?.toLowerCase().includes(q) ||
        s.customerPhone?.toLowerCase().includes(q)
    )
  }, [rows, warehouseId, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  return (
    <>
      <WarehousePageHeader
        title="Dispatch Orders"
        subtitle="Confirmed sales ready to be packed and dispatched"
      />

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <FilterToolbar>
            <FilterSearch
              value={search}
              onChange={setSearch}
              placeholder="Search invoice, customer or phone..."
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
                  <th>Phone</th>
                  <th>City</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-center pe-3">Actions</th>
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
                      Select a warehouse to view dispatch queue
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
                          {s.invoiceNo || 'N/A'}
                        </Link>
                      </td>
                      <td>{s.customerName || '—'}</td>
                      <td>{s.customerPhone || '—'}</td>
                      <td>{s.city || '—'}</td>
                      <td>{formatCount((s.items || []).length)}</td>
                      <td className="fw-semibold">{formatPKR(s.totalAmount)}</td>
                      <td>
                        <SaleStatusChip status={s.status || 'draft'} />
                      </td>
                      <td className="text-center pe-3">
                        <Button
                          size="sm"
                          variant="primary"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => setDispatchSaleId(s._id)}
                        >
                          <IconifyIcon icon="bx:package" className="fs-16" />
                          Mark Out for Delivery
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

      <OutForDeliveryModal
        show={!!dispatchSaleId}
        saleId={dispatchSaleId}
        onHide={() => setDispatchSaleId(null)}
      />
    </>
  )
}

export default WarehouseDispatchOrdersPage
