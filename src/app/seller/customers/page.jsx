import { useEffect, useMemo, useState } from 'react'
import { Badge, Card, CardBody, CardHeader, Col, Dropdown, Nav, Row, Spinner, Table, Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTItle from '@/components/PageTItle'
import { useAuth } from '@/hooks/useAuth'
import { useGetSalesQuery } from '@/services/authenticateendpoint/sales'
import { useGetProjectsBySellerQuery } from '@/services/authenticateendpoint/project'
import {
  formatCount,
  getStatusColor,
  prettyLabel,
} from '../components/formatters'
import { formatCurrencyRounded } from '@/helpers/currency'
import CompactKpiTile from '../components/CompactKpiTile'
import SaleStatusChip from '@/components/SaleStatusChip'
import { FilterSelect, FilterSearch, FilterClearAll } from '@/components/Filters'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'

const initials = (n) =>
  (n || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

const isThisMonth = (d) => {
  if (!d) return false
  const dt = new Date(d)
  const now = new Date()
  return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear()
}

const SellerCustomersPage = () => {
  const { id: sellerId } = useAuth()
  const [search, setSearch] = useState('')
  const [projectId, setProjectId] = useState('')
  const [customerStatus, setCustomerStatus] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [selectedKey, setSelectedKey] = useState(null)
  const [sort, setSort] = useState({ field: 'totalSpent', dir: 'desc' })
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tablePage, setTablePage] = useState(1)

  const { data: projects = [] } = useGetProjectsBySellerQuery(sellerId, {
    skip: !sellerId,
    refetchOnMountOrArgChange: true,
  })

  const { data: salesResponse, isLoading } = useGetSalesQuery(
    { page: 1, limit: 500, filter: { sellerId: sellerId || '', status: '', search: '' } },
    { skip: !sellerId, refetchOnMountOrArgChange: true }
  )

  const scopedSales = useMemo(() => {
    const rows = salesResponse?.data || []
    return projectId ? rows.filter((s) => s.project === projectId) : rows
  }, [salesResponse, projectId])

  const customers = useMemo(() => {
    const map = new Map()
    scopedSales.forEach((s) => {
      const key = s.customerPhone || s.customerName
      if (!key) return
      const existing =
        map.get(key) || {
          key,
          name: s.customerName || 'Unknown',
          phone: s.customerPhone || null,
          city: s.city || null,
          country: s.country || null,
          address: s.address || null,
          orders: [],
          totalOrders: 0,
          totalSpent: 0,
          dueAmount: 0,
          lastOrder: null,
          firstOrder: null,
        }
      existing.orders.push(s)
      existing.totalOrders += 1
      existing.totalSpent += Number(s.totalAmount) || 0
      existing.dueAmount += Number(s.payment?.balanceAmount) || 0
      const created = s.createdAt ? new Date(s.createdAt) : null
      if (created) {
        if (!existing.lastOrder || created > existing.lastOrder) existing.lastOrder = created
        if (!existing.firstOrder || created < existing.firstOrder) existing.firstOrder = created
      }
      map.set(key, existing)
    })
    return Array.from(map.values())
  }, [scopedSales])

  const cityOptions = useMemo(() => {
    const cities = new Set()
    customers.forEach((c) => {
      if (c.city) cities.add(c.city)
    })
    return Array.from(cities).sort()
  }, [customers])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = customers
    if (q) {
      rows = rows.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q)
      )
    }
    if (customerStatus) {
      rows = rows.filter((c) => {
        const isActive = c.lastOrder && Date.now() - c.lastOrder.getTime() < 90 * 24 * 3600 * 1000
        return customerStatus === 'active' ? isActive : !isActive
      })
    }
    if (cityFilter) rows = rows.filter((c) => c.city === cityFilter)

    return [...rows].sort((a, b) => {
      const av = a[sort.field]
      const bv = b[sort.field]
      let cmp = 0
      if (typeof av === 'string' || typeof bv === 'string') {
        cmp = (av || '').localeCompare(bv || '')
      } else if (av instanceof Date || bv instanceof Date) {
        cmp = (av?.getTime() || 0) - (bv?.getTime() || 0)
      } else {
        cmp = (av || 0) - (bv || 0)
      }
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [customers, search, customerStatus, cityFilter, sort])

  const stats = useMemo(() => {
    const total = customers.length
    const active = customers.filter(
      (c) => c.lastOrder && Date.now() - c.lastOrder.getTime() < 90 * 24 * 3600 * 1000
    ).length
    const newThisMonth = customers.filter((c) => isThisMonth(c.firstOrder)).length
    const repeat = customers.filter((c) => c.totalOrders > 1).length
    const outstandingTotal = customers.reduce((a, c) => a + c.dueAmount, 0)
    const outstandingCount = customers.filter((c) => c.dueAmount > 0).length
    return { total, active, newThisMonth, repeat, outstandingTotal, outstandingCount }
  }, [customers])

  useEffect(() => {
    if (!selectedKey && filtered.length > 0) setSelectedKey(filtered[0].key)
  }, [filtered, selectedKey])

  const selected = filtered.find((c) => c.key === selectedKey) || null

  const paged = useMemo(() => {
    const start = (tablePage - 1) * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [filtered, tablePage, rowsPerPage])

  const totalPagesTbl = Math.max(1, Math.ceil(filtered.length / rowsPerPage))

  const kpiCards = [
    {
      label: 'Total Customers',
      value: formatCount(stats.total),
      sub: 'All time',
      color: 'success',
      icon: 'bx:group',
    },
    {
      label: 'Active Customers',
      value: formatCount(stats.active),
      sub: stats.total ? `${((stats.active / stats.total) * 100).toFixed(1)}% of total` : 'No data',
      color: 'info',
      icon: 'bx:user-check',
    },
    {
      label: 'New This Month',
      value: formatCount(stats.newThisMonth),
      sub: 'This month',
      color: 'warning',
      icon: 'bx:user-plus',
    },
    {
      label: 'Repeat Customers',
      value: formatCount(stats.repeat),
      sub: stats.total ? `${((stats.repeat / stats.total) * 100).toFixed(1)}% of total` : 'No data',
      color: 'primary',
      icon: 'bx:refresh',
    },
    {
      label: 'Outstanding Balance',
      value: formatCurrencyRounded(stats.outstandingTotal),
      sub: `From ${formatCount(stats.outstandingCount)} customers`,
      color: 'danger',
      icon: 'bx:wallet',
    },
  ]

  const toggleSort = (field) =>
    setSort((s) =>
      s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'asc' }
    )

  const sortIcon = (field) => {
    if (sort.field !== field) return 'bx:chevron-down'
    return sort.dir === 'asc' ? 'bx:chevron-up' : 'bx:chevron-down'
  }

  return (
    <>
      <PageTItle title="Customers" />

      <Row className="mb-3 align-items-center g-3">
        <Col className="flex-grow-1">
          <h3 className="mb-0">Customers</h3>
          <p className="text-muted mb-0">Manage and view your customers</p>
        </Col>
        <Col md="auto">
          <FilterSelect
            size="sm"
            value={projectId}
            onChange={setProjectId}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p._id, label: p.name })),
            ]}
            style={{ minWidth: 180, height: 40 }}
          />
        </Col>
      </Row>

      <Row className="g-2 mb-3 row-cols-2 row-cols-sm-3 row-cols-md-5">
        {kpiCards.map((k) => (
          <CompactKpiTile key={k.label} {...k} />
        ))}
      </Row>

      <Row className="g-3">
        <Col lg={selected ? 8 : 12}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <FilterSearch
                  className="flex-grow-1"
                  value={search}
                  onChange={setSearch}
                  placeholder="Search customers by name, phone..."
                  style={{ minWidth: 220 }}
                />
                <FilterSelect
                  label="Customer Status"
                  value={customerStatus}
                  onChange={setCustomerStatus}
                  options={[
                    { value: '', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  style={{ width: 160, height: 40 }}
                />
                <FilterSelect
                  label="City"
                  value={cityFilter}
                  onChange={setCityFilter}
                  options={[
                    { value: '', label: 'All' },
                    ...cityOptions.map((c) => ({ value: c, label: c })),
                  ]}
                  style={{ width: 160, height: 40 }}
                />
                <FilterClearAll
                  onClear={() => {
                    setSearch('')
                    setCustomerStatus('')
                    setCityFilter('')
                    setProjectId('')
                    setTablePage(1)
                  }}
                />
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <Table hover className="table-centered table-nowrap mb-0">
                  <thead className="bg-light text-muted">
                    <tr>
                      <th className="ps-3" style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
                        <span className="d-inline-flex align-items-center gap-1">
                          Customer
                          <IconifyIcon icon={sortIcon('name')} className="fs-14" />
                        </span>
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('phone')}>
                        <span className="d-inline-flex align-items-center gap-1">
                          Phone
                          <IconifyIcon icon={sortIcon('phone')} className="fs-14" />
                        </span>
                      </th>
                      <th>City</th>
                      <th>Total Orders</th>
                      <th>Total Spent</th>
                      <th>Last Order</th>
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
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted p-5">
                          No data
                        </td>
                      </tr>
                    ) : (
                      paged.map((c) => {
                        const isActive =
                          c.lastOrder && Date.now() - c.lastOrder.getTime() < 90 * 24 * 3600 * 1000
                        const subLine = c.orders.find((o) => o.address)?.address
                        return (
                          <tr
                            key={c.key}
                            style={{ cursor: 'pointer' }}
                            className={selected?.key === c.key ? 'table-active' : ''}
                            onClick={() => setSelectedKey(c.key)}
                          >
                            <td className="ps-3">
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-soft-success flex-centered text-success fw-bold flex-shrink-0"
                                  style={{ width: 36, height: 36 }}
                                >
                                  {initials(c.name)}
                                </div>
                                <div className="d-flex flex-column">
                                  <span className="fw-semibold">{c.name}</span>
                                  {subLine ? (
                                    <small className="text-muted">{subLine}</small>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                            <td>{c.phone || '—'}</td>
                            <td>{c.city || '—'}</td>
                            <td>{formatCount(c.totalOrders)}</td>
                            <td className="fw-semibold">{formatCurrencyRounded(c.totalSpent)}</td>
                            <td>
                              {c.lastOrder
                                ? c.lastOrder.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </td>
                            <td>
                              <Badge bg={isActive ? 'success' : 'secondary'} className="px-2 py-1">
                                {isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="text-center pe-3" onClick={(e) => e.stopPropagation()}>
                              <div className="hstack gap-1 justify-content-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary btn-sm rounded-circle p-1 border-0"
                                  title="View"
                                  onClick={() => setSelectedKey(c.key)}
                                >
                                  <IconifyIcon icon="solar:eye-broken" className="fs-18" />
                                </button>
                                <Dropdown align="end">
                                  <Dropdown.Toggle
                                    as="button"
                                    className="btn btn-outline-secondary btn-sm rounded-circle p-1 border-0 arrow-none"
                                  >
                                    <IconifyIcon icon="bx:dots-horizontal-rounded" className="fs-18" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setSelectedKey(c.key)}>
                                      View details
                                    </Dropdown.Item>
                                    {(() => {
                                      const latest = c.orders
                                        .slice()
                                        .sort(
                                          (a, b) =>
                                            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                                        )[0]?._id
                                      return latest ? (
                                        <Dropdown.Item
                                          as={Link}
                                          to={`/sales/sales-edit/${latest}`}
                                        >
                                          Edit customer
                                        </Dropdown.Item>
                                      ) : null
                                    })()}
                                    <Dropdown.Item as={Link} to="/sales/sales-add">
                                      New order
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </Table>
              </div>
              <CustomTablePaginations
                limit={rowsPerPage}
                setLimit={setRowsPerPage}
                page={tablePage}
                setPage={setTablePage}
                totalPages={totalPagesTbl}
              />
            </CardBody>
          </Card>
        </Col>

        {selected && (
          <Col lg={4}>
            <Card className="mb-0">
              <CardHeader className="border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Customer Details</h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted p-0"
                    onClick={() => setSelectedKey(null)}
                  >
                    <IconifyIcon icon="bx:x" className="fs-20" />
                  </button>
                </div>
              </CardHeader>
              <CardBody>
                {(() => {
                  const mostRecentOrderId = selected.orders
                    .slice()
                    .sort(
                      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    )[0]?._id
                  return (
                    <div className="d-flex gap-2 mb-3">
                      <Link
                        to={mostRecentOrderId ? `/sales/sales-edit/${mostRecentOrderId}` : '#'}
                        className={`btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 ${
                          mostRecentOrderId ? '' : 'disabled'
                        }`}
                      >
                        <IconifyIcon icon="bx:edit" className="fs-16" /> Edit Customer
                      </Link>
                      <Link
                        to="/sales/sales-add"
                        className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      >
                        <IconifyIcon icon="bx:plus" className="fs-16" /> New Order
                      </Link>
                    </div>
                  )
                })()}

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-soft-success flex-centered text-success fw-bold flex-shrink-0"
                    style={{ width: 52, height: 52, fontSize: 18 }}
                  >
                    {initials(selected.name)}
                  </div>
                  <div>
                    <div className="fw-bold fs-16">{selected.name}</div>
                    <Badge bg="success" className="mt-1">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 small mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <IconifyIcon icon="bx:phone" className="text-muted" />
                    <span>{selected.phone || <span className="text-muted">No data</span>}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <IconifyIcon icon="bx:envelope" className="text-muted" />
                    <span className="text-muted">No data</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <IconifyIcon icon="bx:map" className="text-muted" />
                    <span>
                      {[selected.address, selected.city, selected.country].filter(Boolean).join(', ') || (
                        <span className="text-muted">No data</span>
                      )}
                    </span>
                  </div>
                </div>

                <Row className="g-2 mb-3">
                  <Col>
                    <div className="text-center border rounded p-2">
                      <small className="text-muted d-block">Total Orders</small>
                      <div className="fw-bold">{formatCount(selected.totalOrders)}</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="text-center border rounded p-2">
                      <small className="text-muted d-block">Total Spent</small>
                      <div className="fw-bold text-dark">{formatCurrencyRounded(selected.totalSpent)}</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="text-center border rounded p-2">
                      <small className="text-muted d-block">Due Amount</small>
                      <div className="fw-bold text-danger">{formatCurrencyRounded(selected.dueAmount)}</div>
                    </div>
                  </Col>
                </Row>

                <Tab.Container defaultActiveKey="orders">
                  <Nav variant="tabs" className="mb-2">
                    <Nav.Item>
                      <Nav.Link eventKey="orders" className="fw-semibold">
                        Order History
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="notes">Notes</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="addresses">Addresses</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="orders">
                      {selected.orders.length === 0 ? (
                        <div className="text-center text-muted py-3">No data</div>
                      ) : (
                        <>
                          <Table size="sm" borderless className="mb-0">
                            <thead className="text-muted small">
                              <tr>
                                <th>Order No.</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selected.orders.slice(0, 5).map((o) => (
                                <tr key={o._id}>
                                  <td className="fw-semibold">
                                    <Link to={`/sales/sales-detail/${o._id}`} className="text-dark">
                                      {o.invoiceNo || '-'}
                                    </Link>
                                  </td>
                                  <td>
                                    {o.createdAt
                                      ? new Date(o.createdAt).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        })
                                      : '—'}
                                  </td>
                                  <td className="fw-semibold">{formatCurrencyRounded(o.totalAmount)}</td>
                                  <td>
                                    <SaleStatusChip status={o.status || 'draft'} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <div className="text-end mt-2">
                            <Link to="/seller/orders" className="text-dark fw-semibold small">
                              View All Orders →
                            </Link>
                          </div>
                        </>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="notes">
                      <div className="text-center text-muted py-3">No data</div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="addresses">
                      {selected.address ? (
                        <div className="small">
                          <IconifyIcon icon="bx:map" className="text-muted me-1" />
                          {[selected.address, selected.city, selected.country].filter(Boolean).join(', ')}
                        </div>
                      ) : (
                        <div className="text-center text-muted py-3">No data</div>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </>
  )
}

export default SellerCustomersPage
