import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, Table, Form, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import IconButton from '@mui/material/IconButton'
import { useGetVouchersQuery } from '@/services/authenticateendpoint/account'

const toDisplayDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
    return date.toLocaleDateString()
}

const VoucherListTable = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const queryArgs = useMemo(() => {
        const args = {}
        if (fromDate) args.from = fromDate
        if (toDate) args.to = toDate
        return args
    }, [fromDate, toDate])

    const { data: vouchers = [], isLoading, isFetching, error } = useGetVouchersQuery(queryArgs)

    const filteredVouchers = useMemo(() => vouchers.filter((v) => {
        const matchesSearch = (v.voucherNo || '').toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === '' || v.status === statusFilter
        return matchesSearch && matchesStatus
    }), [vouchers, search, statusFilter])

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
                {error && (
                    <Alert variant="danger" className="mb-3">
                        Failed to load vouchers.
                    </Alert>
                )}
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
                            <Row className="g-2">
                                <Col md={6}>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        placeholder="From"
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Control
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        placeholder="To"
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                {(isLoading || isFetching) && (
                    <div className="py-4 text-center">
                        <Spinner animation="border" />
                    </div>
                )}

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
                            {!isLoading && filteredVouchers.map((v) => (
                                <tr key={v._id || v.voucherNo}>
                                    <td className="fw-medium text-primary">
                                        <Link to={`/accounts/vouchers/${v._id}`}>{v.voucherNo}</Link>
                                    </td>
                                    <td>{toDisplayDate(v.date)}</td>
                                    <td>{v.memo}</td>
                                    <td>{getStatusBadge(v.status)}</td>
                                    <td className="text-center">
                                        <IconButton size="small" className="btn btn-soft-primary btn-sm" onClick={() => navigate(`/accounts/vouchers/${v._id}`)}>
                                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && filteredVouchers.length === 0 && (
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
