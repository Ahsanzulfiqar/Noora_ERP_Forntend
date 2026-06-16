import { useMemo, useState } from 'react'
import { Card, CardHeader, Table, Form, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAccountsQuery } from '@/services/authenticateendpoint/account'

const SAMPLE_LEDGER_ROWS = [
    { id: 1, date: '2026-05-01', voucherNo: 'JV-000001', memo: 'Opening balance', debit: 10000, credit: 0, balance: 10000 },
    { id: 2, date: '2026-05-05', voucherNo: 'IN-000001', memo: 'Sale payment (COD)', debit: 2500, credit: 0, balance: 12500 },
    { id: 3, date: '2026-05-10', voucherNo: 'IN-000002', memo: 'Sale payment (COD)', debit: 1200, credit: 0, balance: 13700 },
    { id: 4, date: '2026-05-15', voucherNo: 'OUT-000001', memo: 'Office rent payment', debit: 0, credit: 2000, balance: 11700 },
    { id: 5, date: '2026-05-20', voucherNo: 'IN-000003', memo: 'Sale payment (ONLINE)', debit: 3000, credit: 0, balance: 14700 },
    { id: 6, date: '2026-05-24', voucherNo: 'OUT-000002', memo: 'Electricity bill', debit: 0, credit: 300, balance: 14400 },
]

const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const LedgerTable = () => {
    const [accountId, setAccountId] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [rows, setRows] = useState([])
    const [hasSearched, setHasSearched] = useState(false)

    const { data: accounts = [] } = useGetAccountsQuery({ isActive: true })

    const handleSearch = () => {
        if (!accountId) {
            alert('Please select an account')
            return
        }
        setRows(SAMPLE_LEDGER_ROWS)
        setHasSearched(true)
    }

    const { opening, totalDebit, totalCredit, closing } = useMemo(() => {
        if (!rows.length) return { opening: 0, totalDebit: 0, totalCredit: 0, closing: 0 }
        const opening = rows[0]?.balance - (rows[0]?.debit || 0) + (rows[0]?.credit || 0)
        const totalDebit = rows.reduce((s, r) => s + (r.debit || 0), 0)
        const totalCredit = rows.reduce((s, r) => s + (r.credit || 0), 0)
        const closing = rows[rows.length - 1]?.balance ?? 0
        return { opening, totalDebit, totalCredit, closing }
    }, [rows])

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
                <div>
                    <h4 className="mb-1">Ledger</h4>
                    <p className="text-muted mb-0 small">View transactions for an account</p>
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
                                Account <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                                <option value="">Select account…</option>
                                {accounts.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.code} — {a.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>
                                Date From <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>
                                Date To <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Button variant="primary" className="w-100" onClick={handleSearch}>
                            <IconifyIcon icon="solar:magnifer-broken" className="me-1" /> Search
                        </Button>
                    </Col>
                </Row>

                {hasSearched && (
                    <>
                        <div className="table-responsive">
                            <Table className="align-middle mb-0 table-hover">
                                <thead className="bg-light-subtle text-muted text-uppercase small">
                                    <tr>
                                        <th>Date</th>
                                        <th>Voucher No.</th>
                                        <th>Description / Memo</th>
                                        <th className="text-end">Debit (AED)</th>
                                        <th className="text-end">Credit (AED)</th>
                                        <th className="text-end">Balance (AED)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.date}</td>
                                            <td>
                                                <Link to={`/admin/accounts/vouchers/${r.id}`} className="text-primary fw-medium">
                                                    {r.voucherNo}
                                                </Link>
                                            </td>
                                            <td>{r.memo}</td>
                                            <td className="text-end">{fmt(r.debit)}</td>
                                            <td className="text-end">{fmt(r.credit)}</td>
                                            <td className="text-end fw-medium">{fmt(r.balance)}</td>
                                        </tr>
                                    ))}
                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                No transactions for this account in the selected range.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        <Row className="g-3 mt-3 pt-3 border-top">
                            <Col md={3}>
                                <div className="text-muted small">Opening Balance</div>
                                <div className="h5 mb-0">{fmt(opening)}</div>
                            </Col>
                            <Col md={3}>
                                <div className="text-muted small">Total Debit</div>
                                <div className="h5 mb-0 text-success">{fmt(totalDebit)}</div>
                            </Col>
                            <Col md={3}>
                                <div className="text-muted small">Total Credit</div>
                                <div className="h5 mb-0 text-danger">{fmt(totalCredit)}</div>
                            </Col>
                            <Col md={3}>
                                <div className="text-muted small">Closing Balance</div>
                                <div className="h5 mb-0 fw-bold">{fmt(closing)}</div>
                            </Col>
                        </Row>
                    </>
                )}
            </Card.Body>
        </Card>
    )
}

export default LedgerTable
