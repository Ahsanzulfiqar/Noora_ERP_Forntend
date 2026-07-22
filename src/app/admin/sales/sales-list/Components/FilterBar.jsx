import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Form, Row, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAllUsersQuery } from '@/services/authenticateendpoint/users'
import { useGetAllProjectsQuery } from '@/services/authenticateendpoint/project'
import { useGetAllCouriersQuery } from '@/services/authenticateendpoint/courier'
import { useAuth } from '@/hooks/useAuth'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import { FilterSelect, FilterDate } from '@/components/Filters'

const startOfMonth = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

const toIsoDate = (d) => {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out For Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
]

const FilterBar = ({ onApply }) => {
  const { role, id: userId } = useAuth()
  const isSeller = role === 'SELLER'

  const [draft, setDraft] = useState({
    dateFrom: toIsoDate(startOfMonth()),
    dateTo: toIsoDate(new Date()),
    projectId: '',
    sellerId: isSeller ? userId : '',
    status: '',
    courierId: '',
    search: '',
  })

  const { data: allUsers = [], error: usersError } = useGetAllUsersQuery()
  const { data: projects = [], error: projectsError } = useGetAllProjectsQuery()
  const { data: couriers = [], error: couriersError } = useGetAllCouriersQuery()

  useEffect(() => {
    if (usersError) toast.error(extractApiErrorMessage(usersError));
  }, [usersError]);
  useEffect(() => {
    if (projectsError) toast.error(extractApiErrorMessage(projectsError));
  }, [projectsError]);
  useEffect(() => {
    if (couriersError) toast.error(extractApiErrorMessage(couriersError));
  }, [couriersError]);

  const sellers = useMemo(
    () => (allUsers || []).filter((u) => u.role?.toUpperCase() === 'SELLER' && u.isActive),
    [allUsers]
  )

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  // Auto-apply whenever any filter changes (only when both dates are set)
  useEffect(() => {
    if (!draft.dateFrom || !draft.dateTo) return
    onApply?.({
      from: draft.dateFrom ? new Date(draft.dateFrom) : null,
      to: draft.dateTo ? new Date(draft.dateTo) : null,
      projectId: draft.projectId,
      sellerId: draft.sellerId,
      status: draft.status,
      courierId: draft.courierId,
      search: draft.search,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.dateFrom, draft.dateTo, draft.projectId, draft.sellerId, draft.status, draft.courierId, draft.search])

  const handleClear = () => {
    setDraft({
      dateFrom: toIsoDate(startOfMonth()),
      dateTo: toIsoDate(new Date()),
      projectId: '',
      sellerId: isSeller ? userId : '',
      status: '',
      courierId: '',
      search: '',
    })
  }

  return (
    <Card className="mb-3">
      <CardBody>
        <Row className="g-2 align-items-end">
          <Col md={6} lg>
            <FilterDate
              inline
              label="From"
              value={draft.dateFrom}
              onChange={(v) => setField('dateFrom', v)}
            />
          </Col>
          <Col md={6} lg>
            <FilterDate
              inline
              label="To"
              value={draft.dateTo}
              onChange={(v) => setField('dateTo', v)}
            />
          </Col>
          <Col md={6} lg>
            <FilterSelect
              label="Seller"
              value={draft.sellerId}
              onChange={(v) => setField('sellerId', v)}
              disabled={isSeller}
              options={[
                { value: '', label: 'All Sellers' },
                ...sellers.map((s) => ({ value: s._id, label: s.name })),
              ]}
            />
          </Col>
          <Col md={6} lg>
            <FilterSelect
              label="Project"
              value={draft.projectId}
              onChange={(v) => setField('projectId', v)}
              options={[
                { value: '', label: 'All Projects' },
                ...projects.map((p) => ({ value: p._id, label: p.name })),
              ]}
            />
          </Col>
          <Col md={6} lg>
            <FilterSelect
              label="Status"
              value={draft.status}
              onChange={(v) => setField('status', v)}
              options={STATUS_OPTIONS}
            />
          </Col>
          <Col md={6} lg>
            <FilterSelect
              label="Courier"
              value={draft.courierId}
              onChange={(v) => setField('courierId', v)}
              options={[
                { value: '', label: 'All Couriers' },
                ...couriers.map((c) => ({ value: c._id, label: c.name })),
              ]}
            />
          </Col>
          <Col md={12} lg="auto" className="d-flex gap-2 justify-content-end ms-auto">
            <Button variant="light" className="d-inline-flex align-items-center gap-1 text-nowrap" onClick={handleClear}>
              <IconifyIcon icon="bx:x" />
              <span>Clear All</span>
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default FilterBar
