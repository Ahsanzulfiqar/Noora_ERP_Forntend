import { useMemo, useState } from 'react'
import { Card, CardHeader, Table, Form, Row, Col, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetTrialBalanceQuery } from '@/services/authenticateendpoint/account'

const formatNumber = (value) =>
    Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const toDisplayDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
    return date.toLocaleDateString()
}

const TrialBalanceTable = () => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [appliedFrom, setAppliedFrom] = useState('')
    const [appliedTo, setAppliedTo] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    const queryArgs = useMemo(() => {
        const args = {}
        if (appliedFrom) args.from = appliedFrom
        if (appliedTo) args.to = appliedTo
        return args
    }, [appliedFrom, appliedTo])

    const { data, isFetching, error } = useGetTrialBalanceQuery(queryArgs, {
        skip: !hasSearched || (!appliedFrom && !appliedTo),
    })

    const rows = data?.rows || []
    const totalDebit = Number(data?.totalDebit || 0)
    const totalCredit = Number(data?.totalCredit || 0)
    const isBalanced = Boolean(data?.isBalanced)
    const difference = Math.abs(totalDebit - totalCredit)

    const handleSearch = () => {
        if (!fromDate && !toDate) {
            alert('Please select at least one date')
            return
        }
        setAppliedFrom(fromDate)
        setAppliedTo(toDate)
        setHasSearched(true)
    }

    const handleClear = () => {
        setFromDate('')
        setToDate('')
        setAppliedFrom('')
        setAppliedTo('')
        setHasSearched(false)
    }

    return (
        <Card className="shadow-sm border-0 overflow-hidden">
            <CardHeader className="bg-white border-bottom d-flex justify-content-between align-items-start gap-3 py-3">
                <div>
                    <h4 className="mb-1">Trial Balance</h4>
                    <p className="text-muted mb-0 small">Summary of all accounts</p>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                    {hasSearched && isBalanced && <Badge bg="success">Balanced</Badge>}
                    {hasSearched && !isBalanced && <Badge bg="warning text-dark">Not Balanced</Badge>}
                    <Button variant="outline-secondary" size="sm" disabled={!hasSearched}>
                        <IconifyIcon icon="solar:download-minimalistic-broken" className="me-1" />
                        Export
                    </Button>
                </div>
            </CardHeader>

            <Card.Body className="p-0">
                <div className="px-3 px-lg-4 pt-3 pt-lg-4 pb-4">
                    <Row className="g-3 align-items-end">
                        <Col lg={3} md={6}>
                            <Form.Group>
                                <Form.Label className="fw-medium">
                                    From <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3} md={6}>
                            <Form.Group>
                                <Form.Label className="fw-medium">
                                    To <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={2} md={6}>
                            <Button variant="primary" className="w-100" onClick={handleSearch}>
                                <IconifyIcon icon="solar:magnifer-broken" className="me-1" /> Search
                            </Button>
                        </Col>
                        <Col lg={2} md={6}>
                            <Button variant="outline-secondary" className="w-100" onClick={handleClear}>
                                Clear
                            </Button>
                        </Col>
                    </Row>

                    {error && (
                        <Alert variant="danger" className="mt-3 mb-0">
                            Failed to load trial balance.
                        </Alert>
                    )}

                    {hasSearched && data && (
                        <div className="mt-3 p-3 rounded border bg-light-subtle d-flex flex-wrap justify-content-between align-items-center gap-2">
                            <div>
                                <div className="text-muted small">Period</div>
                                <div className="fw-semibold">
                                    {toDisplayDate(data.from)} - {toDisplayDate(data.to)}
                                </div>
                            </div>
                            <div className="d-flex gap-3 flex-wrap">
                                <div>
                                    <div className="text-muted small">Total Debit</div>
                                    <div className="fw-semibold text-success">{formatNumber(totalDebit)}</div>
                                </div>
                                <div>
                                    <div className="text-muted small">Total Credit</div>
                                    <div className="fw-semibold text-danger">{formatNumber(totalCredit)}</div>
                                </div>
                                <div>
                                    <div className="text-muted small">Difference</div>
                                    <div className="fw-semibold text-warning">{formatNumber(difference)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isFetching && hasSearched && (
                        <div className="py-4 text-center">
                            <Spinner animation="border" />
                        </div>
                    )}
                </div>

                {hasSearched && (
                    <div className="table-responsive border-top">
                        <Table className="align-middle mb-0 table-hover">
                            <thead className="bg-light-subtle text-muted text-uppercase small">
                                <tr>
                                    <th className="ps-4">Code</th>
                                    <th>Account Name</th>
                                    <th>Type</th>
                                    <th className="text-end">Debit (AED)</th>
                                    <th className="text-end">Credit (AED)</th>
                                    <th className="text-end pe-4">Balance (AED)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.accountId || `${row.accountCode}-${row.accountName}`}>
                                        <td className="fw-medium ps-4">{row.accountCode}</td>
                                        <td>{row.accountName}</td>
                                        <td>{row.accountType}</td>
                                        <td className="text-end">{formatNumber(row.debitTotal)}</td>
                                        <td className="text-end">{formatNumber(row.creditTotal)}</td>
                                        <td className="text-end pe-4">{formatNumber(row.balance)}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            No trial balance rows found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="fw-bold border-top">
                                    <td colSpan="3" className="ps-4">Total</td>
                                    <td className="text-end text-success">{formatNumber(totalDebit)}</td>
                                    <td className="text-end text-danger">{formatNumber(totalCredit)}</td>
                                    <td className="text-end pe-4">{formatNumber(difference)}</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default TrialBalanceTable
