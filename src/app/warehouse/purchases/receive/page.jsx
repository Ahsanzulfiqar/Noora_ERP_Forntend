import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, Spinner, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import {
  useGetAllPurchasesQuery,
  useGetPurchaseByIdQuery,
  usePostToStockMutation,
} from '@/services/authenticateendpoint/purchases'
import { formatCount } from '@/app/seller/components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'
import PostToStockModal from '@/app/admin/purchases/purchaseDetail/components/PostToStockModal'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const isReceivable = (p) => {
  const s = (p.status || '').toLowerCase()
  return s === 'confirmed' && !p.postedToStock
}

const WarehouseReceiveStockPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [receivingId, setReceivingId] = useState(null)

  const { data: purchases = [], isLoading } = useGetAllPurchasesQuery()
  const { data: receivingPurchase, isFetching: loadingReceiving } = useGetPurchaseByIdQuery(
    receivingId,
    { skip: !receivingId }
  )
  const [postToStock, { isLoading: isPosting, error: postError }] = usePostToStockMutation()

  useEffect(() => {
    if (postError) toast.error(extractApiErrorMessage(postError))
  }, [postError])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const scoped = purchases.filter((p) => p.warehouse === warehouseId && isReceivable(p))
    if (!q) return scoped
    return scoped.filter(
      (p) =>
        p.invoiceNo?.toLowerCase().includes(q) ||
        p.supplierName?.toLowerCase().includes(q)
    )
  }, [purchases, warehouseId, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  const handleReceive = (id) => setReceivingId(id)

  const handleConfirmPost = async ({ items, taxAmount }) => {
    try {
      await postToStock({ purchaseId: receivingId, items, taxAmount }).unwrap()
      toast.success('Stock received successfully')
      setReceivingId(null)
    } catch (err) {
      // toast already shown by effect above
    }
  }

  return (
    <>
      <WarehousePageHeader
        title="Receive Stock"
        subtitle="Confirmed purchases waiting to be received into stock"
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
              placeholder="Search invoice or supplier..."
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
                  <th>Supplier</th>
                  <th>Purchase Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-center pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                    </td>
                  </tr>
                ) : !warehouseId ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted p-5">
                      Select a warehouse to view pending receipts
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  paged.map((p) => (
                    <tr key={p._id}>
                      <td className="ps-3 fw-semibold">{p.invoiceNo || 'N/A'}</td>
                      <td>{p.supplierName || '—'}</td>
                      <td>
                        {p.purchaseDate
                          ? new Date(p.purchaseDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td>{formatCount((p.items || []).length)}</td>
                      <td className="fw-semibold">{formatCurrencyRounded(p.totalAmount)}</td>
                      <td>
                        <Badge bg="warning-subtle" className="text-warning px-2 py-1">
                          Confirmed
                        </Badge>
                      </td>
                      <td className="text-center pe-3">
                        <Button
                          size="sm"
                          variant="primary"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => handleReceive(p._id)}
                        >
                          <IconifyIcon icon="bx:import" className="fs-16" />
                          Receive
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

      <PostToStockModal
        show={!!receivingId && !loadingReceiving}
        items={receivingPurchase?.items || []}
        loading={isPosting}
        onConfirm={handleConfirmPost}
        onCancel={() => setReceivingId(null)}
      />
    </>
  )
}

export default WarehouseReceiveStockPage
