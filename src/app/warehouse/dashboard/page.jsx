import { useMemo } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Spinner, Badge, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import SaleStatusChip from '@/components/SaleStatusChip'
import { useGetWarehouseStockQuery } from '@/services/authenticateendpoint/warehouse'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { useGetAllPurchasesQuery } from '@/services/authenticateendpoint/purchases'
import { useGetStockTransfersQuery } from '@/services/authenticateendpoint/stockTransfer'
import CompactKpiTile from '@/app/seller/components/CompactKpiTile'
import { formatCount } from '@/app/seller/components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'
import WarehousePageHeader from '../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../hooks/useSelectedWarehouse'

const isActiveTransferStatus = (status) => {
  const s = (status || '').toLowerCase()
  return s && s !== 'completed' && s !== 'cancelled'
}

const isPendingDispatchStatus = (status) => {
  const s = (status || '').toLowerCase()
  return s === 'confirmed' || s === 'reserved'
}

const isIncomingPurchaseStatus = (purchase) => {
  const s = (purchase.status || '').toLowerCase()
  return s === 'confirmed' && !purchase.postedToStock
}

const WarehouseDashboardPage = () => {
  const [warehouseId] = useSelectedWarehouse()

  const { data: stockResponse, isLoading: stockLoading } = useGetWarehouseStockQuery(
    { filter: { warehouseId }, page: 1, limit: 500 },
    { skip: !warehouseId, refetchOnMountOrArgChange: true }
  )
  const { data: salesResponse, isLoading: salesLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: '', status: '', search: '' } },
    { refetchOnMountOrArgChange: true }
  )
  const { data: purchases = [], isLoading: purchasesLoading } = useGetAllPurchasesQuery()
  const { data: transfers = [], isLoading: transfersLoading } = useGetStockTransfersQuery()

  const stockRows = stockResponse?.data || []
  const salesRows = salesResponse?.data || []

  const warehouseSales = useMemo(
    () => salesRows.filter((s) => s.warehouse === warehouseId),
    [salesRows, warehouseId]
  )
  const warehousePurchases = useMemo(
    () => purchases.filter((p) => p.warehouse === warehouseId),
    [purchases, warehouseId]
  )
  const warehouseTransfers = useMemo(
    () =>
      transfers.filter(
        (t) => t.fromWarehouse === warehouseId || t.toWarehouse === warehouseId
      ),
    [transfers, warehouseId]
  )

  const stats = useMemo(() => {
    const totalUnits = stockRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0)
    const totalValue = stockRows.reduce(
      (sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.avgCost) || 0),
      0
    )
    const lowStockItems = stockRows.filter(
      (r) => Number(r.reorderLevel) > 0 && Number(r.quantity) <= Number(r.reorderLevel)
    )
    const pendingDispatch = warehouseSales.filter((s) => isPendingDispatchStatus(s.status))
    const incomingPurchases = warehousePurchases.filter(isIncomingPurchaseStatus)
    const activeTransfers = warehouseTransfers.filter((t) => isActiveTransferStatus(t.status))

    return {
      totalUnits,
      totalValue,
      lowStockCount: lowStockItems.length,
      pendingDispatchCount: pendingDispatch.length,
      incomingCount: incomingPurchases.length,
      activeTransferCount: activeTransfers.length,
      lowStockItems,
      pendingDispatch,
      incomingPurchases,
      activeTransfers,
    }
  }, [stockRows, warehouseSales, warehousePurchases, warehouseTransfers])

  const isLoading = stockLoading || salesLoading || purchasesLoading || transfersLoading

  const kpis = [
    {
      label: 'Stock Units',
      value: formatCount(stats.totalUnits),
      sub: formatCurrencyRounded(stats.totalValue),
      icon: 'bx:package',
      color: 'success',
      isEmpty: !warehouseId,
    },
    {
      label: 'Low Stock Alerts',
      value: formatCount(stats.lowStockCount),
      sub: 'Below reorder',
      icon: 'bx:error-circle',
      color: 'danger',
      isEmpty: !warehouseId,
    },
    {
      label: 'Pending Dispatch',
      value: formatCount(stats.pendingDispatchCount),
      sub: 'Confirmed sales',
      icon: 'bx:package',
      color: 'warning',
      isEmpty: !warehouseId,
    },
    {
      label: 'Incoming Purchases',
      value: formatCount(stats.incomingCount),
      sub: 'To receive',
      icon: 'bx:import',
      color: 'primary',
      isEmpty: !warehouseId,
    },
    {
      label: 'Stock Transfers',
      value: formatCount(stats.activeTransferCount),
      sub: 'In progress',
      icon: 'bx:transfer',
      color: 'info',
      isEmpty: !warehouseId,
    },
  ]

  return (
    <>
      <WarehousePageHeader
        title="Dashboard"
        subtitle="Real-time snapshot of your warehouse operations"
      />

      <Row className="g-2 mb-3 row-cols-2 row-cols-sm-3 row-cols-md-5">
        {kpis.map((k) => (
          <CompactKpiTile key={k.label} {...k} />
        ))}
      </Row>

      <Row className="g-3 mb-3">
        <Col lg={6}>
          <Card className="mb-0 h-100">
            <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Low Stock Alerts</h5>
              <Link to="/warehouse/inventory/low-stock" className="text-dark fw-semibold fs-13">
                View All
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : stats.lowStockItems.length === 0 ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <Table hover className="mb-0 table-centered">
                  <thead className="bg-light text-muted">
                    <tr>
                      <th className="ps-3">Product</th>
                      <th>On Hand</th>
                      <th className="pe-3">Reorder Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockItems.slice(0, 5).map((r) => (
                      <tr key={r._id}>
                        <td className="ps-3">
                          <div className="fw-semibold">{r.productName || '—'}</div>
                          {r.variantName ? (
                            <small className="text-muted">{r.variantName}</small>
                          ) : null}
                        </td>
                        <td>
                          <Badge bg="danger-subtle" className="text-danger px-2 py-1">
                            {formatCount(r.quantity)}
                          </Badge>
                        </td>
                        <td className="pe-3">{formatCount(r.reorderLevel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="mb-0 h-100">
            <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Dispatch</h5>
              <Link to="/warehouse/sales/dispatch" className="text-dark fw-semibold fs-13">
                View All
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : stats.pendingDispatch.length === 0 ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <Table hover className="mb-0 table-centered">
                  <thead className="bg-light text-muted">
                    <tr>
                      <th className="ps-3">Invoice</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th className="pe-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.pendingDispatch.slice(0, 5).map((s) => (
                      <tr key={s._id}>
                        <td className="ps-3 fw-semibold">{s.invoiceNo || 'N/A'}</td>
                        <td>{s.customerName || '—'}</td>
                        <td className="fw-semibold">{formatCurrencyRounded(s.totalAmount)}</td>
                        <td className="pe-3">
                          <SaleStatusChip status={s.status || 'draft'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={6}>
          <Card className="mb-0 h-100">
            <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Incoming Purchases</h5>
              <Link to="/warehouse/purchases/receive" className="text-dark fw-semibold fs-13">
                View All
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : stats.incomingPurchases.length === 0 ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <Table hover className="mb-0 table-centered">
                  <thead className="bg-light text-muted">
                    <tr>
                      <th className="ps-3">Invoice</th>
                      <th>Supplier</th>
                      <th>Items</th>
                      <th className="pe-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.incomingPurchases.slice(0, 5).map((p) => (
                      <tr key={p._id}>
                        <td className="ps-3 fw-semibold">{p.invoiceNo || 'N/A'}</td>
                        <td>{p.supplierName || '—'}</td>
                        <td>{formatCount((p.items || []).length)}</td>
                        <td className="pe-3 fw-semibold">{formatCurrencyRounded(p.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="mb-0 h-100">
            <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Stock Transfers</h5>
              <Link to="/warehouse/transfers" className="text-dark fw-semibold fs-13">
                View All
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : stats.activeTransfers.length === 0 ? (
                <div className="text-center text-muted py-4">No data</div>
              ) : (
                <Table hover className="mb-0 table-centered">
                  <thead className="bg-light text-muted">
                    <tr>
                      <th className="ps-3">Transfer</th>
                      <th>From</th>
                      <th>To</th>
                      <th className="pe-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.activeTransfers.slice(0, 5).map((t) => {
                      const direction =
                        t.fromWarehouse === warehouseId ? 'Out' : 'In'
                      return (
                        <tr key={t._id}>
                          <td className="ps-3 fw-semibold">
                            {t.transferNo || 'N/A'}{' '}
                            <Badge
                              bg={direction === 'Out' ? 'warning-subtle' : 'success-subtle'}
                              className={`text-${direction === 'Out' ? 'warning' : 'success'} ms-1`}
                            >
                              {direction}
                            </Badge>
                          </td>
                          <td>{t.fromWarehouseName || '—'}</td>
                          <td>{t.toWarehouseName || '—'}</td>
                          <td className="pe-3">
                            <Badge bg="info-subtle" className="text-info px-2 py-1">
                              {t.status || '—'}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default WarehouseDashboardPage
