import { useMemo, useState } from 'react'
import { Badge, Card, CardBody, CardHeader, Spinner, Table } from 'react-bootstrap'
import { FilterButton, FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import { useGetWarehouseStockQuery } from '@/services/authenticateendpoint/warehouse'
import { formatCount } from '@/app/seller/components/formatters'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const WINDOWS = [
  { key: 'all', label: 'All' },
  { key: 'expired', label: 'Expired' },
  { key: '30', label: '< 30 days' },
  { key: '60', label: '< 60 days' },
  { key: '90', label: '< 90 days' },
]

const dayDiff = (date) => {
  if (!date) return null
  const now = new Date()
  const exp = new Date(date)
  if (Number.isNaN(exp.getTime())) return null
  const ms = exp.getTime() - now.setHours(0, 0, 0, 0)
  return Math.floor(ms / (24 * 3600 * 1000))
}

const getExpiryStatus = (days) => {
  if (days === null) return { label: 'No expiry', color: 'secondary' }
  if (days < 0) return { label: 'Expired', color: 'danger' }
  if (days < 30) return { label: `${days} days`, color: 'warning' }
  if (days < 60) return { label: `${days} days`, color: 'info' }
  return { label: `${days} days`, color: 'success' }
}

const WarehouseExpiryAlertPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [search, setSearch] = useState('')
  const [window, setWindow] = useState('90')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: stockResponse, isLoading } = useGetWarehouseStockQuery(
    { filter: { warehouseId }, page: 1, limit: 500 },
    { skip: !warehouseId, refetchOnMountOrArgChange: true }
  )

  const rows = stockResponse?.data || []

  const batches = useMemo(() => {
    const out = []
    rows.forEach((r) => {
      ;(r.batches || []).forEach((b, i) => {
        if (!b.expiryDate) return
        out.push({
          key: `${r._id}-${i}`,
          productName: r.productName,
          variantName: r.variantName,
          batchNo: b.batchNo,
          expiryDate: b.expiryDate,
          quantity: b.quantity,
          days: dayDiff(b.expiryDate),
        })
      })
    })
    return out
  }, [rows])

  const inWindow = useMemo(() => {
    let list = batches
    if (window === 'expired') list = batches.filter((b) => b.days !== null && b.days < 0)
    else if (window === '30') list = batches.filter((b) => b.days !== null && b.days < 30)
    else if (window === '60') list = batches.filter((b) => b.days !== null && b.days < 60)
    else if (window === '90') list = batches.filter((b) => b.days !== null && b.days < 90)
    return list.sort((a, b) => (a.days ?? Infinity) - (b.days ?? Infinity))
  }, [batches, window])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return inWindow
    return inWindow.filter(
      (b) =>
        b.productName?.toLowerCase().includes(q) ||
        b.variantName?.toLowerCase().includes(q) ||
        b.batchNo?.toLowerCase().includes(q)
    )
  }, [inWindow, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  return (
    <>
      <WarehousePageHeader
        title="Expiry Alert"
        subtitle="Batches nearing or past expiry — earliest first"
      />

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <FilterToolbar>
            <FilterSearch
              value={search}
              onChange={setSearch}
              placeholder="Search product, variant or batch..."
              className="flex-grow-1"
              style={{ minWidth: 240 }}
            />
            <div className="d-flex flex-wrap gap-2">
              {WINDOWS.map((w) => (
                <FilterButton
                  key={w.key}
                  variant={window === w.key ? 'primary' : 'outline-secondary'}
                  active={window === w.key}
                  size="sm"
                  onClick={() => {
                    setWindow(w.key)
                    setPage(1)
                  }}
                >
                  {w.label}
                </FilterButton>
              ))}
            </div>
          </FilterToolbar>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="ps-3">Product</th>
                  <th>Variant</th>
                  <th>Batch #</th>
                  <th>Expiry Date</th>
                  <th>Quantity</th>
                  <th className="pe-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                    </td>
                  </tr>
                ) : !warehouseId ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted p-5">
                      Select a warehouse to view expiry alerts
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  paged.map((b) => {
                    const s = getExpiryStatus(b.days)
                    return (
                      <tr key={b.key}>
                        <td className="ps-3 fw-semibold">{b.productName || '—'}</td>
                        <td>{b.variantName || '—'}</td>
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
                        <td className="pe-3">
                          <Badge bg={`${s.color}-subtle`} className={`text-${s.color} px-2 py-1`}>
                            {s.label}
                          </Badge>
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

export default WarehouseExpiryAlertPage
