import { useState } from 'react'
import { Card, CardHeader, CardTitle, Table, Form, Row, Col, Button, Badge } from 'react-bootstrap'
import Flatpickr from 'react-flatpickr'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const INITIAL_TB_DATA = [
    { id: 1, account: '1001 - Cash in Hand', type: 'Asset', debit: 15000, credit: 0, balance: 15000 },
    { id: 2, account: '1002 - Bank Account', type: 'Asset', debit: 85000, credit: 0, balance: 85000 },
    { id: 3, account: '2001 - Accounts Payable', type: 'Liability', debit: 0, credit: 10000, balance: -10000 },
    { id: 4, account: '4001 - Sales Revenue', type: 'Revenue', debit: 0, credit: 120000, balance: -120000 },
    { id: 5, account: '5001 - Office Rent', type: 'Expense', debit: 30000, credit: 0, balance: 30000 },
]

const TrialBalanceTable = () => {
    const [dateRange, setDateRange] = useState([])
    const [data, setData] = useState([])
    const [isGenerated, setIsGenerated] = useState(false)

    const handleGenerate = () => {
        setData(INITIAL_TB_DATA)
        setIsGenerated(true)
    }

    const totalDebit = data.reduce((sum, item) => sum + item.debit, 0)
    const totalCredit = data.reduce((sum, item) => sum + item.credit, 0)
    const isBalanced = isGenerated && totalDebit === totalCredit

    return (
        <Card>
            <CardHeader>
                <CardTitle as="h4">Trial Balance</CardTitle>
            </CardHeader>
            <Card.Body>
                <Row className="mb-3 align-items-end">
                    <Col md={6}>
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
                    <div className="table-responsive">
                        <Table bordered hover className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>Account</th>
                                    <th>Type</th>
                                    <th className="text-end">Debit Total</th>
                                    <th className="text-end">Credit Total</th>
                                    <th className="text-end">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.account}</td>
                                        <td>{item.type}</td>
                                        <td className="text-end">{item.debit > 0 ? item.debit.toLocaleString() : '-'}</td>
                                        <td className="text-end">{item.credit > 0 ? item.credit.toLocaleString() : '-'}</td>
                                        <td className="text-end fw-medium">{item.balance.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="fw-bold bg-light">
                                <tr>
                                    <td colSpan="2">Total</td>
                                    <td className="text-end text-primary">{totalDebit.toLocaleString()}</td>
                                    <td className="text-end text-primary">{totalCredit.toLocaleString()}</td>
                                    <td className="text-end">
                                        {isBalanced ? (
                                            <Badge bg="success">Balanced</Badge>
                                        ) : (
                                            <Badge bg="danger">Not Balanced</Badge>
                                        )}
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
