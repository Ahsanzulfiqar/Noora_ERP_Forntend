import { useState } from 'react'
import { Card, CardHeader, CardTitle, Table, Form, Row, Col, Badge, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import IconButton from '@mui/material/IconButton'
import Flatpickr from 'react-flatpickr'

const INITIAL_VOUCHERS = [
    { id: 1, voucherNo: 'JV-2026-001', date: '2026-02-20', memo: 'Salary payment for Feb', status: 'POSTED' },
    { id: 2, voucherNo: 'JV-2026-002', date: '2026-02-21', memo: 'Office rent payment', status: 'POSTED' },
    { id: 3, voucherNo: 'JV-2026-003', date: '2026-02-22', memo: 'Petty cash reimbursement', status: 'DRAFT' },
    { id: 4, voucherNo: 'JV-2026-004', date: '2026-02-23', memo: 'Client payment received', status: 'VOID' },
]

const VoucherListTable = () => {
    const navigate = useNavigate()
    const [vouchers] = useState(INITIAL_VOUCHERS)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [dateRange, setDateRange] = useState([])

    const filteredVouchers = vouchers.filter((v) => {
        const matchesSearch = v.voucherNo.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === '' || v.status === statusFilter
        // Date range filtering could be added here
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status) => {
        switch (status) {
            case 'POSTED': return <Badge bg="success">POSTED</Badge>
            case 'DRAFT': return <Badge bg="warning text-dark">DRAFT</Badge>
            case 'VOID': return <Badge bg="danger">VOID</Badge>
            default: return <Badge bg="secondary">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <CardTitle as="h4">Vouchers List</CardTitle>
                <Link to="/accounts/journal/new" className="btn btn-primary btn-sm">
                    New Voucher
                </Link>
            </CardHeader>
            <Card.Body>
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Voucher No</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search voucher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="">All Status</option>
                                <option value="POSTED">POSTED</option>
                                <option value="DRAFT">DRAFT</option>
                                <option value="VOID">VOID</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Date Range</Form.Label>
                            <Flatpickr
                                className="form-control"
                                placeholder="Select date range"
                                options={{ mode: 'range', dateFormat: 'Y-m-d' }}
                                onChange={(dates) => setDateRange(dates)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="table-responsive">
                    <Table className="align-middle mb-0 table-hover table-centered">
                        <thead className="bg-light-subtle">
                            <tr>
                                <th>Voucher No</th>
                                <th>Date</th>
                                <th>Memo</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVouchers.map((v) => (
                                <tr key={v.id}>
                                    <td className="fw-medium text-primary">
                                        <Link to={`/accounts/vouchers/${v.id}`}>{v.voucherNo}</Link>
                                    </td>
                                    <td>{v.date}</td>
                                    <td>{v.memo}</td>
                                    <td>{getStatusBadge(v.status)}</td>
                                    <td className="text-center">
                                        <IconButton size="small" className="btn btn-soft-primary btn-sm" onClick={() => navigate(`/accounts/vouchers/${v.id}`)}>
                                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                            {filteredVouchers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No vouchers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    )
}

export default VoucherListTable
