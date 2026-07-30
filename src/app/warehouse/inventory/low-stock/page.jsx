import { useMemo, useState } from 'react'
import { Alert, Badge, Card, CardBody, CardHeader, Spinner, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import { useGetWarehouseStockQuery } from '@/services/authenticateendpoint/warehouse'
import { formatCount } from '@/app/seller/components/formatters'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const WarehouseLowStockPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: stockResponse, isLoading } = useGetWarehouseStockQuery(
    { filter: { warehouseId }, page: 1, limit: 500 },
    { skip: !warehouseId, refetchOnMountOrArgChange: true }
  )

  const rows = stockResponse?.data || []

  const lowStockRows = useMemo(
    () =>
      rows
        .filter(
          (r) => Number(r.reorderLevel) > 0 && Number(r.quantity) <= Number(r.reorderLevel)
        )
        .sort((a, b) => {
          const aDeficit = Number(a.reorderLevel) - Number(a.quantity)
          const bDeficit = Number(b.reorderLevel) - Number(b.quantity)
          return bDeficit - aDeficit
        }),
    [rows]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return lowStockRows
    return lowStockRows.filter(
      (r) =>
        r.productName?.toLowerCase().includes(q) ||
        r.variantName?.toLowerCase().includes(q)
    )
  }, [lowStockRows, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  const outOfStockCount = lowStockRows.filter((r) => Number(r.quantity) === 0).length

  return (
    <>
      <WarehousePageHeader
        title="Low Stock"
        subtitle="Products below the reorder threshold — worst first"
      />

      {warehouseId && !isLoading && lowStockRows.length > 0 && (
        <Alert variant="danger" className="d-flex align-items-center gap-2 mb-3">
          <IconifyIcon icon="bx:error-circle" className="fs-20" />
          <div>
            <strong>{formatCount(lowStockRows.length)}</strong> products need replenishment
            {outOfStockCount > 0 ? (
              <>
                {' '}
                — <strong>{formatCount(outOfStockCount)}</strong> completely out of stock
              </>
            ) : null}
            .
          </div>
        </Alert>
      )}

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
                  <th>Reorder Level</th>
                  <th className="pe-3">Shortfall</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                    </td>
                  </tr>
                ) : !warehouseId ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted p-5">
                      Select a warehouse to view low stock
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  paged.map((r) => {
                    const isOut = Number(r.quantity) === 0
                    const shortfall = Number(r.reorderLevel) - Number(r.quantity)
                    return (
                      <tr key={r._id}>
                        <td className="ps-3 fw-semibold">{r.productName || '—'}</td>
                        <td>{r.variantName || '—'}</td>
                        <td>
                          <Badge
                            bg={isOut ? 'danger' : 'warning-subtle'}
                            className={isOut ? 'text-white px-2 py-1' : 'text-warning px-2 py-1'}
                          >
                            {formatCount(r.quantity)}
                          </Badge>
                        </td>
                        <td>{formatCount(r.reorderLevel)}</td>
                        <td className="pe-3 fw-semibold text-danger">
                          -{formatCount(shortfall)}
                        </td>
                      </tr>
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

export default WarehouseLowStockPage
