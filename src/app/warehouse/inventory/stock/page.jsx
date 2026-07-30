import { Fragment, useMemo, useState } from 'react'
import { Badge, Card, CardBody, CardHeader, Spinner, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import { useGetWarehouseStockQuery } from '@/services/authenticateendpoint/warehouse'
import { formatCount } from '@/app/seller/components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const WarehouseStockPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [expandedId, setExpandedId] = useState(null)

  const { data: stockResponse, isLoading } = useGetWarehouseStockQuery(
    { filter: { warehouseId }, page: 1, limit: 500 },
    { skip: !warehouseId, refetchOnMountOrArgChange: true }
  )

  const rows = stockResponse?.data || []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.productName?.toLowerCase().includes(q) ||
        r.variantName?.toLowerCase().includes(q)
    )
  }, [rows, search])

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  return (
    <>
      <WarehousePageHeader title="Stock" subtitle="Current stock across your warehouse" />

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
              placeholder="Search product or variant..."
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
                  <th className="ps-3">Product</th>
                  <th>Variant</th>
                  <th>On Hand</th>
                  <th>Reserved</th>
                  <th>Reorder Level</th>
                  <th>Avg Cost</th>
                  <th>Batches</th>
                  <th className="pe-3"></th>
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
                      Select a warehouse to view stock
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  paged.map((r) => {
                    const isLow =
                      Number(r.reorderLevel) > 0 &&
                      Number(r.quantity) <= Number(r.reorderLevel)
                    const isExpanded = expandedId === r._id
                    return (
                      <Fragment key={r._id}>
                        <tr>
                          <td className="ps-3 fw-semibold">{r.productName || '—'}</td>
                          <td>{r.variantName || '—'}</td>
                          <td>
                            <Badge
                              bg={isLow ? 'danger-subtle' : 'success-subtle'}
                              className={`text-${isLow ? 'danger' : 'success'} px-2 py-1`}
                            >
                              {formatCount(r.quantity)}
                            </Badge>
                          </td>
                          <td>{formatCount(r.reserved || 0)}</td>
                          <td>{formatCount(r.reorderLevel || 0)}</td>
                          <td>{formatCurrencyRounded(r.avgCost || 0)}</td>
                          <td>{formatCount((r.batches || []).length)}</td>
                          <td className="pe-3 text-end">
                            {(r.batches || []).length > 0 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary rounded-circle p-1 border-0"
                                title={isExpanded ? 'Hide batches' : 'Show batches'}
                                onClick={() => setExpandedId(isExpanded ? null : r._id)}
                              >
                                <IconifyIcon
                                  icon={isExpanded ? 'bx:chevron-up' : 'bx:chevron-down'}
                                  className="fs-18"
                                />
                              </button>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="bg-light-subtle">
                              <div className="p-3">
                                <div className="fw-semibold mb-2">Batches</div>
                                <Table size="sm" className="mb-0">
                                  <thead className="text-muted small">
                                    <tr>
                                      <th>Batch #</th>
                                      <th>Expiry</th>
                                      <th>Quantity</th>
                                      <th>Unit Cost</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {r.batches.map((b, i) => (
                                      <tr key={`${b.batchNo}-${i}`}>
                                        <td>{b.batchNo || '—'}</td>
                                        <td>
                                          {b.expiryDate
                                            ? new Date(b.expiryDate).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                              })
                                            : '—'}
                                        </td>
                                        <td>{formatCount(b.quantity)}</td>
                                        <td>{formatCurrencyRounded(b.unitCost || 0)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })
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
    </>
  )
}

export default WarehouseStockPage
