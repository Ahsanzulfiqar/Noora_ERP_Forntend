import { useMemo, useState } from 'react'
import { Card, CardHeader, Table, Form, Row, Col, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAccountsQuery } from '@/services/authenticateendpoint/account'

const SAMPLE_BALANCES = {
    '1000': { debit: 14400, credit: 0 },
    '1010': { debit: 8500, credit: 0 },
    '1100': { debit: 5000, credit: 0 },
    '1200': { debit: 12500, credit: 0 },
    '2000': { debit: 0, credit: 6000 },
    '3000': { debit: 0, credit: 20000 },
    '4000': { debit: 0, credit: 15700 },
    '5001': { debit: 2000, credit: 0 },
    '5002': { debit: 300, credit: 0 },
}

const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const TrialBalanceTable = () => {
    const [asOnDate, setAsOnDate] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    const { data: accounts = [] } = useGetAccountsQuery({ isActive: true })

    const rows = useMemo(() => {
        if (!hasSearched) return []
        return accounts.map((a) => {
            const bal = SAMPLE_BALANCES[a.code] || { debit: 0, credit: 0 }
            return { _id: a._id, code: a.code, name: a.name, debit: bal.debit, credit: bal.credit }
        })
    }, [accounts, hasSearched])

    const totals = useMemo(() => {
        const totalDebit = rows.reduce((s, r) => s + (r.debit || 0), 0)
        const totalCredit = rows.reduce((s, r) => s + (r.credit || 0), 0)
        return { totalDebit, totalCredit, difference: totalDebit - totalCredit }
    }, [rows])

    const handleSearch = () => {
        if (!asOnDate) {
            alert('Please select an As On Date')
            return
        }
        setHasSearched(true)
    }

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
                <div>
                    <h4 className="mb-1">Trial Balance</h4>
                    <p className="text-muted mb-0 small">Summary of all accounts</p>
                </div>
                <Button variant="outline-secondary" size="sm" disabled={!hasSearched}>
                    <IconifyIcon icon="solar:download-minimalistic-broken" className="me-1" />
                    Export
                </Button>
            </CardHeader>
            <Card.Body>
                <Row className="g-3 align-items-end mb-4">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>
                                As On Date <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Button variant="primary" className="w-100" onClick={handleSearch}>
                            <IconifyIcon icon="solar:magnifer-broken" className="me-1" /> Search
                        </Button>
                    </Col>
                </Row>

                {hasSearched && (
                    <div className="table-responsive">
                        <Table className="align-middle mb-0 table-hover">
                            <thead className="bg-light-subtle text-muted text-uppercase small">
                                <tr>
                                    <th>Code</th>
                                    <th>Account Name</th>
                                    <th className="text-end">Debit (AED)</th>
                                    <th className="text-end">Credit (AED)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r._id}>
                                        <td className="fw-medium">{r.code}</td>
                                        <td>{r.name}</td>
                                        <td className="text-end">{fmt(r.debit)}</td>
                                        <td className="text-end">{fmt(r.credit)}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            No accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="fw-bold border-top">
                                    <td colSpan="2">Total</td>
                                    <td className="text-end text-success">{fmt(totals.totalDebit)}</td>
                                    <td className="text-end text-danger">{fmt(totals.totalCredit)}</td>
                                </tr>
                                <tr className="bg-light-subtle">
                                    <td colSpan="2" className="fw-medium">Difference</td>
                                    <td colSpan="2" className="text-end fw-bold text-warning">
                                        {fmt(Math.abs(totals.difference))}
                                    </td>
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
