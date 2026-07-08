import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Form, Row, Button } from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAllUsersQuery } from '@/services/authenticateendpoint/users'
import { useGetAllProjectsQuery } from '@/services/authenticateendpoint/project'
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse'
import { useGetAllCouriersQuery } from '@/services/authenticateendpoint/courier'
import { useAuth } from '@/hooks/useAuth'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'

const startOfMonth = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
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

const FilterBar = ({ onApply, onExport }) => {
  const { role, id: userId } = useAuth()
  const isSeller = role === 'SELLER'

  const [draft, setDraft] = useState({
    dateRange: [startOfMonth(), new Date()],
    projectId: '',
    sellerId: isSeller ? userId : '',
    warehouseId: '',
    status: '',
    courierId: '',
    search: '',
  })

  const { data: allUsers = [], error: usersError, refetch: refetchUsers } = useGetAllUsersQuery()
  const { data: projects = [], error: projectsError, refetch: refetchProjects } = useGetAllProjectsQuery()
  const { data: warehouses = [], error: warehousesError, refetch: refetchWarehouses } = useGetAllWarehousesQuery()
  const { data: couriers = [], error: couriersError } = useGetAllCouriersQuery()

  useEffect(() => {
    if (usersError) toast.error(extractApiErrorMessage(usersError));
  }, [usersError]);
  useEffect(() => {
    if (projectsError) toast.error(extractApiErrorMessage(projectsError));
  }, [projectsError]);
  useEffect(() => {
    if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
  }, [warehousesError]);
  useEffect(() => {
    if (couriersError) toast.error(extractApiErrorMessage(couriersError));
  }, [couriersError]);

  const sellers = useMemo(
    () => (allUsers || []).filter((u) => u.role?.toUpperCase() === 'SELLER' && u.isActive),
    [allUsers]
  )

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const handleApply = () => {
    onApply?.({
      from: draft.dateRange?.[0] || null,
      to: draft.dateRange?.[1] || null,
      projectId: draft.projectId,
      sellerId: draft.sellerId,
      warehouseId: draft.warehouseId,
      status: draft.status,
      courierId: draft.courierId,
      search: draft.search,
    })
  }

  return (
    <Card className="mb-3">
      <CardBody>
        <Row className="g-2 align-items-end">
          <Col md={6} lg={2}>
            <Form.Label className="text-muted small mb-1">Date Range</Form.Label>
            <Flatpickr
              className="form-control"
              value={draft.dateRange}
              onChange={(dates) => setField('dateRange', dates)}
              options={{ mode: 'range', dateFormat: 'd M Y' }}
              placeholder="Select date range"
            />
          </Col>
          <Col md={6} lg={2}>
            <Form.Label className="text-muted small mb-1">Project</Form.Label>
            <Form.Select
              value={draft.projectId}
              onChange={(e) => setField('projectId', e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Label className="text-muted small mb-1">Seller</Form.Label>
            <Form.Select
              value={draft.sellerId}
              onChange={(e) => setField('sellerId', e.target.value)}
              disabled={isSeller}
            >
              <option value="">All Sellers</option>
              {sellers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Label className="text-muted small mb-1">Warehouse</Form.Label>
            <Form.Select
              value={draft.warehouseId}
              onChange={(e) => setField('warehouseId', e.target.value)}
            >
              <option value="">All Warehouses</option>
              {warehouses.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Label className="text-muted small mb-1">Status</Form.Label>
            <Form.Select
              value={draft.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Label className="text-muted small mb-1">Courier</Form.Label>
            <Form.Select
              value={draft.courierId}
              onChange={(e) => setField('courierId', e.target.value)}
            >
              <option value="">All Couriers</option>
              {couriers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs={12} className="d-flex gap-2 justify-content-end">
            <Button variant="light" className="d-flex align-items-center gap-1">
              <IconifyIcon icon="bx:filter-alt" />
              <span className="d-none d-xl-inline">More Filters</span>
            </Button>
            <Button variant="primary" className="d-flex align-items-center gap-1" onClick={handleApply}>
              <IconifyIcon icon="bx:search" />
              <span>Apply</span>
            </Button>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-2">
          <Button variant="outline-secondary" size="sm" className="d-flex align-items-center gap-1" onClick={onExport}>
            <IconifyIcon icon="bx:export" />
            Export
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default FilterBar
