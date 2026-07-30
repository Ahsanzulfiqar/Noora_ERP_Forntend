import { useMemo, useState } from 'react'
import { Badge, Card, CardBody, CardHeader, Col, Dropdown, Form, Row, Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import PageTItle from '@/components/PageTItle'
import { useAuth } from '@/hooks/useAuth'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { useGetProjectsBySellerQuery } from '@/services/authenticateendpoint/project'
import CompactKpiTile from '../components/CompactKpiTile'
import SaleStatusChip from '@/components/SaleStatusChip'
import { FilterSelect, FilterSearch, FilterDateRange, FilterClearAll } from '@/components/Filters'
import {
  formatCount,
  getPaymentColor,
  getStatusColor,
  prettyLabel,
  startOfMonth,
  toIsoDate,
} from '../components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'

const STATUS_TABS = [
  { key: '', label: 'All Orders', icon: 'bx:receipt', color: 'success' },
  { key: 'draft', label: 'New', icon: 'bx:file', color: 'secondary' },
  { key: 'confirmed', label: 'Confirmed', icon: 'bx:check-circle', color: 'primary' },
  { key: 'packed', label: 'Packed', icon: 'bx:package', color: 'primary' },
  { key: 'shipped', label: 'Shipped', icon: 'bx:cube', color: 'success' },
  { key: 'delivered', label: 'Delivered', icon: 'bx:check-shield', color: 'success' },
  { key: 'cancelled', label: 'Cancelled', icon: 'bx:x-circle', color: 'danger' },
]

const fmtDate = (v) => {
  if (!v) return ''
  const [y, m, d] = v.split('-')
  return `${d}/${m}/${y}`
}

const SellerOrdersPage = () => {
  const { id: sellerId } = useAuth()
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [projectId, setProjectId] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dateFrom, setDateFrom] = useState(toIsoDate(startOfMonth()))
  const [dateTo, setDateTo] = useState(toIsoDate(new Date()))
  const [sortDir, setSortDir] = useState('desc')

  const { data: projects = [] } = useGetProjectsBySellerQuery(sellerId, {
    skip: !sellerId,
    refetchOnMountOrArgChange: true,
  })

  const { data: salesResponse, isLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: sellerId || '', status: '', search: '' } },
    { skip: !sellerId, refetchOnMountOrArgChange: true }
  )

  const scopedSales = useMemo(() => {
    const base = salesResponse?.data || []
    return projectId ? base.filter((r) => r.project === projectId) : base
  }, [salesResponse, projectId])

  const statusCounts = useMemo(() => {
    const map = { '': scopedSales.length }
    scopedSales.forEach((r) => {
      const s = (r.status || '').toLowerCase()
      map[s] = (map[s] || 0) + 1
    })
    return map
  }, [scopedSales])

  const filtered = useMemo(() => {
    let data = scopedSales
    if (status) data = data.filter((r) => (r.status || '').toLowerCase() === status.toLowerCase())
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      data = data.filter(
        (r) =>
          r.invoiceNo?.toLowerCase().includes(q) ||
          r.customerName?.toLowerCase().includes(q) ||
          r.customerPhone?.toLowerCase().includes(q)
      )
    }
    if (dateFrom || dateTo) {
      const fromTs = dateFrom ? new Date(dateFrom).getTime() : -Infinity
      const toTs = dateTo ? new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 : Infinity
      data = data.filter((r) => {
        if (!r.createdAt) return true
        const ts = new Date(r.createdAt).getTime()
        return ts >= fromTs && ts <= toTs
      })
    }
    return [...data].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime()
      const tb = new Date(b.createdAt || 0).getTime()
      return sortDir === 'asc' ? ta - tb : tb - ta
    })
  }, [scopedSales, status, search, dateFrom, dateTo, sortDir])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const rows = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  )

  return (
    <>
      <PageTItle title="Orders" />

      <Row className="mb-3 align-items-center g-3">
        <Col className="flex-grow-1">
          <h3 className="mb-0">Orders</h3>
          <p className="text-muted mb-0">Sales &gt; Orders</p>
        </Col>
        <Col md="auto">
          <FilterSelect
            value={projectId}
            onChange={(v) => {
              setProjectId(v)
              setPage(1)
            }}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p._id, label: p.name })),
            ]}
            style={{ minWidth: 180, height: 40 }}
          />
        </Col>
        <Col md="auto">
          <FilterSearch
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search by order no. or customer..."
            style={{ minWidth: 240 }}
          />
        </Col>
      </Row>

      <Row className="g-2 mb-3 row-cols-2 row-cols-sm-3 row-cols-md-5">
        {STATUS_TABS.map((tab) => (
          <CompactKpiTile
            key={tab.key || 'all'}
            label={tab.label}
            value={formatCount(statusCounts[tab.key] || 0)}
            icon={tab.icon}
            color={tab.color}
            active={status === tab.key}
            onClick={() => {
              setStatus(tab.key)
              setPage(1)
            }}
          />
        ))}
      </Row>

      <Card className="mb-0">
        <CardHeader className="border-bottom">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex flex-wrap gap-2 align-items-center flex-grow-1">
              <FilterSelect
                value={status}
                onChange={(v) => {
                  setStatus(v)
                  setPage(1)
                }}
                options={[
                  { value: '', label: 'All Status' },
                  ...STATUS_TABS.filter((t) => t.key).map((t) => ({ value: t.key, label: t.label })),
                ]}
                style={{ width: 160, height: 40 }}
              />

              <FilterDateRange
                from={dateFrom}
                to={dateTo}
                onChange={({ from, to }) => {
                  setDateFrom(from)
                  setDateTo(to)
                  setPage(1)
                }}
                style={{ width: 260 }}
              />

              <FilterClearAll
                onClear={() => {
                  setProjectId('')
                  setStatus('')
                  setSearch('')
                  setDateFrom('')
                  setDateTo('')
                  setPage(1)
                }}
              />
            </div>

            <Link
              to="/sales/sales-add"
              className="btn btn-primary d-flex align-items-center gap-1"
              style={{ height: 40 }}
            >
              <IconifyIcon icon="bx:plus" className="fs-18" /> New Sale
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="table-centered table-nowrap mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="ps-3">Order No.</th>
                  <th>Customer</th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                  >
                    <span className="d-inline-flex align-items-center gap-1">
                      Date
                      <IconifyIcon
                        icon={sortDir === 'asc' ? 'bx:chevron-up' : 'bx:chevron-down'}
                        className="fs-14"
                      />
                    </span>
                  </th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
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
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted p-5">
                      No data
                    </td>
                  </tr>
                ) : (
                  rows.map((s) => (
                    <tr key={s._id}>
                      <td className="ps-3">
                        <Link
                          to={`/sales/sales-detail/${s._id}`}
                          className="text-dark fw-semibold"
                        >
                          {s.invoiceNo || 'N/A'}
                        </Link>
                      </td>
                      <td>{s.customerName || <span className="text-muted">No data</span>}</td>
                      <td>
                        {s.createdAt
                          ? new Date(s.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td>{formatCount(s.items?.length || 0) || '—'}</td>
                      <td className="fw-semibold">{formatCurrencyRounded(s.totalAmount)}</td>
                      <td>
                        <SaleStatusChip status={s.status || 'draft'} />
                      </td>
                      <td>
                        {s.payment?.status ? (
                          <Badge bg={getPaymentColor(s.payment.status)} className="text-capitalize px-2 py-1">
                            {prettyLabel(s.payment.status)}
                          </Badge>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-center pe-3">
                        <div className="hstack gap-1 justify-content-center">
                          <Link
                            to={`/sales/sales-detail/${s._id}`}
                            className="btn btn-outline-secondary btn-sm rounded-circle p-1 border-0"
                            title="View"
                          >
                            <IconifyIcon icon="solar:eye-broken" className="fs-18" />
                          </Link>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              as="button"
                              className="btn btn-outline-secondary btn-sm rounded-circle p-1 border-0 arrow-none"
                            >
                              <IconifyIcon icon="bx:dots-horizontal-rounded" className="fs-18" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item as={Link} to={`/sales/sales-detail/${s._id}`}>
                                View details
                              </Dropdown.Item>
                              <Dropdown.Item as={Link} to={`/sales/sales-edit/${s._id}`}>
                                Edit
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
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
      </Card>
    </>
  )
}

export default SellerOrdersPage
