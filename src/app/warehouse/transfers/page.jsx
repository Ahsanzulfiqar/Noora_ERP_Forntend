import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  Nav,
  Spinner,
  Tab,
  Table,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { FilterSearch, FilterToolbar } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import {
  useConfirmStockTransferMutation,
  useGetStockTransfersQuery,
} from '@/services/authenticateendpoint/stockTransfer'
import { formatCount } from '@/app/seller/components/formatters'
import WarehousePageHeader from '../components/WarehousePageHeader'
import { useSelectedWarehouse } from '../hooks/useSelectedWarehouse'

const isHistoryStatus = (status) => {
  const s = (status || '').toLowerCase()
  return s === 'confirmed' || s === 'completed' || s === 'cancelled'
}

const statusColor = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'confirmed' || s === 'completed') return 'success'
  if (s === 'cancelled') return 'danger'
  if (s === 'pending' || s === 'in_transit') return 'warning'
  return 'info'
}

const TABS = [
  { key: 'outgoing', label: 'Outgoing' },
  { key: 'incoming', label: 'Incoming' },
  { key: 'history', label: 'History' },
]

const WarehouseStockTransfersPage = () => {
  const [warehouseId] = useSelectedWarehouse()
  const [tab, setTab] = useState('outgoing')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [confirmId, setConfirmId] = useState(null)

  const { data: transfers = [], isLoading } = useGetStockTransfersQuery()
  const [confirmTransfer, { isLoading: isConfirming, error: confirmError }] =
    useConfirmStockTransferMutation()

  useEffect(() => {
    if (confirmError) toast.error(extractApiErrorMessage(confirmError))
  }, [confirmError])

  useEffect(() => {
    setPage(1)
  }, [tab])

  const scoped = useMemo(
    () =>
      transfers.filter(
        (t) => t.fromWarehouse === warehouseId || t.toWarehouse === warehouseId
      ),
    [transfers, warehouseId]
  )

  const bucketed = useMemo(() => {
    if (tab === 'outgoing') {
      return scoped.filter((t) => t.fromWarehouse === warehouseId && !isHistoryStatus(t.status))
    }
    if (tab === 'incoming') {
      return scoped.filter((t) => t.toWarehouse === warehouseId && !isHistoryStatus(t.status))
    }
    return scoped.filter((t) => isHistoryStatus(t.status))
  }, [scoped, warehouseId, tab])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return bucketed
    return bucketed.filter(
      (t) =>
        t.transferNo?.toLowerCase().includes(q) ||
        t.fromWarehouseName?.toLowerCase().includes(q) ||
        t.toWarehouseName?.toLowerCase().includes(q)
    )
  }, [bucketed, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const paged = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  const handleConfirmReceive = async () => {
    if (!confirmId) return
    try {
      await confirmTransfer(confirmId).unwrap()
      toast.success('Transfer received into stock')
      setConfirmId(null)
    } catch (err) {
      // toast shown by effect
    }
  }

  const counts = {
    outgoing: scoped.filter(
      (t) => t.fromWarehouse === warehouseId && !isHistoryStatus(t.status)
    ).length,
    incoming: scoped.filter(
      (t) => t.toWarehouse === warehouseId && !isHistoryStatus(t.status)
    ).length,
    history: scoped.filter((t) => isHistoryStatus(t.status)).length,
  }

  return (
    <>
      <WarehousePageHeader
        title="Stock Transfers"
        subtitle="Create, receive, and track transfers between warehouses"
        actions={
          <Link
            to="/inventory/transfer-stock/add"
            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
          >
            <IconifyIcon icon="bx:plus" className="fs-16" />
            Create Transfer
          </Link>
        }
      />

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <Nav variant="tabs" activeKey={tab} onSelect={(k) => setTab(k || 'outgoing')}>
            {TABS.map((t) => (
              <Nav.Item key={t.key}>
                <Nav.Link eventKey={t.key} className="d-flex align-items-center gap-2">
                  {t.label}
                  <Badge bg="secondary-subtle" className="text-dark">
                    {formatCount(counts[t.key])}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </CardHeader>
        <CardBody className="border-bottom p-2">
          <FilterToolbar
            onClear={() => {
              setSearch('')
              setPage(1)
            }}
          >
            <FilterSearch
              value={search}
              onChange={setSearch}
              placeholder="Search transfer no, source or destination..."
              className="flex-grow-1"
              style={{ minWidth: 240 }}
            />
          </FilterToolbar>
        </CardBody>
        <CardBody className="p-0">
          <Tab.Container activeKey={tab}>
            <Tab.Content>
              {TABS.map((t) => (
                <Tab.Pane key={t.key} eventKey={t.key}>
                  <div className="table-responsive">
                    <Table hover className="table-centered mb-0">
                      <thead className="bg-light text-muted">
                        <tr>
                          <th className="ps-3">Transfer No</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Items</th>
                          <th>Created</th>
                          <th>Status</th>
                          {t.key === 'incoming' && (
                            <th className="text-center pe-3">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td
                              colSpan={t.key === 'incoming' ? 7 : 6}
                              className="text-center p-4"
                            >
                              <Spinner animation="border" variant="primary" size="sm" />
                            </td>
                          </tr>
                        ) : !warehouseId ? (
                          <tr>
                            <td
                              colSpan={t.key === 'incoming' ? 7 : 6}
                              className="text-center text-muted p-5"
                            >
                              Select a warehouse to view transfers
                            </td>
                          </tr>
                        ) : paged.length === 0 ? (
                          <tr>
                            <td
                              colSpan={t.key === 'incoming' ? 7 : 6}
                              className="text-center text-muted p-5"
                            >
                              No data
                            </td>
                          </tr>
                        ) : (
                          paged.map((r) => (
                            <tr key={r._id}>
                              <td className="ps-3 fw-semibold">{r.transferNo || '-'}</td>
                              <td>{r.fromWarehouseName || '—'}</td>
                              <td>{r.toWarehouseName || '—'}</td>
                              <td>{formatCount((r.items || []).length)}</td>
                              <td>
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : '—'}
                              </td>
                              <td>
                                <Badge
                                  bg={`${statusColor(r.status)}-subtle`}
                                  className={`text-${statusColor(r.status)} px-2 py-1`}
                                >
                                  {r.status || '—'}
                                </Badge>
                              </td>
                              {t.key === 'incoming' && (
                                <td className="text-center pe-3">
                                  <Button
                                    size="sm"
                                    variant="success"
                                    className="d-inline-flex align-items-center gap-1"
                                    onClick={() => setConfirmId(r._id)}
                                  >
                                    <IconifyIcon icon="bx:check-circle" className="fs-16" />
                                    Receive
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
          <CustomTablePaginations
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </CardBody>
      </Card>

      <Modal show={!!confirmId} onHide={() => setConfirmId(null)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Receive Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm that this transfer has been received into your warehouse. The stock will be
          added to your inventory.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmId(null)} disabled={isConfirming}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmReceive} disabled={isConfirming}>
            {isConfirming ? 'Receiving...' : 'Yes, Receive'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default WarehouseStockTransfersPage
