import { useState } from 'react'
import { Card, CardHeader, CardTitle, Table, Form, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'

const DUMMY_ACCOUNTS = [
    { value: 1, label: '1001 - Cash in Hand' },
    { value: 2, label: '1002 - Bank Account' },
    { value: 3, label: '1101 - Accounts Receivable' },
    { value: 4, label: '2001 - Accounts Payable' },
    { value: 5, label: '4001 - Sales Revenue' },
    { value: 6, label: '5001 - Office Rent' },
]

const INITIAL_LEDGER_DATA = [
    { id: 101, date: '2026-02-01', voucherNo: 'JV-2026-000', memo: 'Opening Balance', debit: 0, credit: 0, balance: 10000 },
    { id: 102, date: '2026-02-05', voucherNo: 'JV-2026-001', memo: 'Office supplies', debit: 0, credit: 500, balance: 9500 },
    { id: 103, date: '2026-02-10', voucherNo: 'JV-2026-002', memo: 'Client payment', debit: 2000, credit: 0, balance: 11500 },
]

const LedgerTable = () => {
    const [account, setAccount] = useState(null)
    const [dateRange, setDateRange] = useState([])
    const [ledgerData, setLedgerData] = useState([])
    const [isGenerated, setIsGenerated] = useState(false)

    const handleGenerate = () => {
        if (!account) {
            alert('Please select an account first')
            return
        }
        setLedgerData(INITIAL_LEDGER_DATA)
        setIsGenerated(true)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle as="h4">Account Ledger</CardTitle>
            </CardHeader>
            <Card.Body>
                <Row className="mb-3 align-items-end">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Account</Form.Label>
                            <Select
                                options={DUMMY_ACCOUNTS}
                                value={account}
                                onChange={(opt) => setAccount(opt)}
                                placeholder="Select account..."
                                classNamePrefix="react-select"
                            />
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
                    <Col md={2}>
                        <Button variant="primary" className="w-100" onClick={handleGenerate}>
                            Generate
                        </Button>
                    </Col>
                </Row>

                {isGenerated && (
                    <>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Card className="bg-light shadow-none border">
                                    <Card.Body className="py-2">
                                        <div className="text-muted mb-1">Opening Balance</div>
                                        <div className="h4 mb-0">10,000.00</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="table-responsive">
                            <Table bordered hover className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Voucher No</th>
                                        <th>Memo</th>
                                        <th className="text-end">Debit</th>
                                        <th className="text-end">Credit</th>
                                        <th className="text-end">Running Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ledgerData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.date}</td>
                                            <td>
                                                <Link to={`/accounts/vouchers/${item.id}`} className="text-primary fw-medium">
                                                    {item.voucherNo}
                                                </Link>
                                            </td>
                                            <td>{item.memo}</td>
                                            <td className="text-end">{item.debit > 0 ? item.debit.toFixed(2) : '-'}</td>
                                            <td className="text-end">{item.credit > 0 ? item.credit.toFixed(2) : '-'}</td>
                                            <td className="text-end fw-medium">{item.balance.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <Row className="mt-3">
                            <Col md={6} className="ms-auto">
                                <Card className="bg-primary text-white shadow-none border-0">
                                    <Card.Body className="py-2 text-end">
                                        <div className="opacity-75 mb-1">Closing Balance</div>
                                        <div className="h4 mb-0">11,500.00</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Card.Body>
        </Card>
    )
}

export default LedgerTable
