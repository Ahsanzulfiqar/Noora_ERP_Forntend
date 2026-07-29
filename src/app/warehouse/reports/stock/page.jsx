import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Nav,
  Spinner,
  Tab,
  Table,
} from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetWarehouseStockQuery } from '@/services/authenticateendpoint/warehouse'
import { formatCount, formatPKR } from '@/app/seller/components/formatters'
import WarehousePageHeader from '../../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../../hooks/useSelectedWarehouse'

const dayDiff = (date) => {
  if (!date) return null
  const now = new Date()
  const exp = new Date(date)
  if (Number.isNaN(exp.getTime())) return null
  const ms = exp.getTime() - now.setHours(0, 0, 0, 0)
  return Math.floor(ms / (24 * 3600 * 1000))
}

const REPORT_TABS = [
  { key: 'stock', label: 'Stock Report' },
  { key: 'lowStock', label: 'Low Stock' },
  { key: 'expiry', label: 'Expiry' },
  { key: 'movement', label: 'Movement' },
]

const WarehouseStockReportsPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [tab, setTab] = useState('stock')

  const { data: stockResponse, isLoading } = useGetWarehouseStockQuery(
    { filter: { warehouseId }, page: 1, limit: 500 },
    { skip: !warehouseId, refetchOnMountOrArgChange: true }
  )

  const rows = stockResponse?.data || []

  const lowStockRows = useMemo(
    () =>
      rows.filter(
        (r) => Number(r.reorderLevel) > 0 && Number(r.quantity) <= Number(r.reorderLevel)
      ),
    [rows]
  )

  const expiringBatches = useMemo(() => {
    const out = []
    rows.forEach((r) => {
      ;(r.batches || []).forEach((b, i) => {
        if (!b.expiryDate) return
        const days = dayDiff(b.expiryDate)
        if (days === null || days >= 90) return
        out.push({
          key: `${r._id}-${i}`,
          productName: r.productName,
          variantName: r.variantName,
          batchNo: b.batchNo,
          expiryDate: b.expiryDate,
          quantity: b.quantity,
          days,
        })
      })
    })
    return out.sort((a, b) => a.days - b.days)
  }, [rows])

  const handlePrint = () => window.print()

  return (
    <>
      <WarehousePageHeader
        title="Stock Reports"
        subtitle="Aggregate views for stock, low-stock, expiry and movement"
        actions={
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-inline-flex align-items-center gap-1"
            onClick={handlePrint}
            disabled={!warehouseId}
          >
            <IconifyIcon icon="bx:printer" className="fs-16" />
            Print
          </Button>
        }
      />

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <Nav variant="tabs" activeKey={tab} onSelect={(k) => setTab(k || 'stock')}>
            {REPORT_TABS.map((t) => (
              <Nav.Item key={t.key}>
                <Nav.Link eventKey={t.key}>{t.label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </CardHeader>
        <CardBody className="p-0">
          <Tab.Container activeKey={tab}>
            <Tab.Content>
              <Tab.Pane eventKey="stock">
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
                        <th className="pe-3">Stock Value</th>
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
                            Select a warehouse to view the stock report
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center text-muted p-5">
                            No data
                          </td>
                        </tr>
                      ) : (
                        rows.map((r) => (
                          <tr key={r._id}>
                            <td className="ps-3 fw-semibold">{r.productName || '—'}</td>
                            <td>{r.variantName || '—'}</td>
                            <td>{formatCount(r.quantity)}</td>
                            <td>{formatCount(r.reserved || 0)}</td>
                            <td>{formatCount(r.reorderLevel || 0)}</td>
                            <td>{formatPKR(r.avgCost || 0)}</td>
                            <td className="pe-3 fw-semibold">
                              {formatPKR((Number(r.quantity) || 0) * (Number(r.avgCost) || 0))}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="lowStock">
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
                            Select a warehouse to view the low stock report
                          </td>
                        </tr>
                      ) : lowStockRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted p-5">
                            No data
                          </td>
                        </tr>
                      ) : (
                        lowStockRows.map((r) => (
                          <tr key={r._id}>
                            <td className="ps-3 fw-semibold">{r.productName || '—'}</td>
                            <td>{r.variantName || '—'}</td>
                            <td>
                              <Badge bg="warning-subtle" className="text-warning px-2 py-1">
                                {formatCount(r.quantity)}
                              </Badge>
                            </td>
                            <td>{formatCount(r.reorderLevel)}</td>
                            <td className="pe-3 fw-semibold text-danger">
                              -{formatCount(Number(r.reorderLevel) - Number(r.quantity))}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="expiry">
                <div className="table-responsive">
                  <Table hover className="table-centered mb-0">
                    <thead className="bg-light text-muted">
                      <tr>
                        <th className="ps-3">Product</th>
                        <th>Variant</th>
                        <th>Batch #</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                        <th className="pe-3">Days</th>
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
                            Select a warehouse to view the expiry report
                          </td>
                        </tr>
                      ) : expiringBatches.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted p-5">
                            No data
                          </td>
                        </tr>
                      ) : (
                        expiringBatches.map((b) => (
                          <tr key={b.key}>
                            <td className="ps-3 fw-semibold">{b.productName || '—'}</td>
                            <td>{b.variantName || '—'}</td>
                            <td>{b.batchNo || '—'}</td>
                            <td>
                              {new Date(b.expiryDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td>{formatCount(b.quantity)}</td>
                            <td className="pe-3">
                              <Badge
                                bg={b.days < 0 ? 'danger-subtle' : 'warning-subtle'}
                                className={`text-${b.days < 0 ? 'danger' : 'warning'} px-2 py-1`}
                              >
                                {b.days < 0 ? 'Expired' : `${b.days} days`}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="movement">
                <div className="text-center text-muted py-5">
                  <div
                    className="rounded-circle bg-soft-primary flex-centered mx-auto mb-3"
                    style={{ width: 64, height: 64 }}
                  >
                    <IconifyIcon icon="bx:transfer" className="fs-32 text-primary" />
                  </div>
                  <h5 className="mb-2">Coming soon</h5>
                  <p className="mb-0">
                    Stock movement report will be available once the backend ledger endpoint is
                    added.
                  </p>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </CardBody>
      </Card>
    </>
  )
}

export default WarehouseStockReportsPage
