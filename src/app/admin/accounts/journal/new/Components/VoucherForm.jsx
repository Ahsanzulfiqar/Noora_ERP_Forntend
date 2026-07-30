import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, Form, Row, Col, Button, Table, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import IconButton from '@mui/material/IconButton'
import { currencyLabel, formatAmount } from '@/helpers/currency'

const DUMMY_ACCOUNTS = [
    { value: 1, label: '1001 - Cash in Hand' },
    { value: 2, label: '1002 - Bank Account' },
    { value: 3, label: '1101 - Accounts Receivable' },
    { value: 4, label: '2001 - Accounts Payable' },
    { value: 5, label: '4001 - Sales Revenue' },
    { value: 6, label: '5001 - Office Rent' },
]

const VoucherForm = () => {
    const [date, setDate] = useState(new Date())
    const [memo, setMemo] = useState('')
    const [lines, setLines] = useState([
        { id: Date.now(), account: null, debit: 0, credit: 0 },
        { id: Date.now() + 1, account: null, debit: 0, credit: 0 },
    ])

    const [totalDebit, setTotalDebit] = useState(0)
    const [totalCredit, setTotalCredit] = useState(0)

    useEffect(() => {
        const d = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0)
        const c = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0)
        setTotalDebit(d)
        setTotalCredit(c)
    }, [lines])

    const handleAddLine = () => {
        setLines([...lines, { id: Date.now(), account: null, debit: 0, credit: 0 }])
    }

    const handleRemoveLine = (id) => {
        if (lines.length > 2) {
            setLines(lines.filter((line) => line.id !== id))
        }
    }

    const handleLineChange = (id, field, value) => {
        setLines(
            lines.map((line) => {
                if (line.id === id) {
                    const updatedLine = { ...line, [field]: value }
                    if (field === 'debit' && parseFloat(value) > 0) updatedLine.credit = 0
                    if (field === 'credit' && parseFloat(value) > 0) updatedLine.debit = 0
                    return updatedLine
                }
                return line
            })
        )
    }

    const isBalanced = totalDebit > 0 && totalDebit === totalCredit

    const handleSave = () => {
        if (!isBalanced) {
            alert('Voucher is not balanced!')
            return
        }
        console.log('Saving Voucher:', { date, memo, lines, totalDebit, totalCredit })
        alert('Voucher Saved Successfully!')
    }

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <CardTitle as="h4">New Journal Voucher</CardTitle>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={!isBalanced}>
                        Save / Post
                    </Button>
                </div>
            </CardHeader>
            <Card.Body>
                <Row className="mb-4">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Flatpickr
                                className="form-control"
                                value={date}
                                onChange={([d]) => setDate(d)}
                                options={{ dateFormat: 'Y-m-d' }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group>
                            <Form.Label>Memo (Description)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="table-responsive mb-4">
                    <Table bordered hover>
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: '50%' }}>Account</th>
                                <th>Debit {currencyLabel()}</th>
                                <th>Credit {currencyLabel()}</th>
                                <th style={{ width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map((line) => (
                                <tr key={line.id}>
                                    <td>
                                        <Select
                                            options={DUMMY_ACCOUNTS}
                                            value={line.account}
                                            onChange={(opt) => handleLineChange(line.id, 'account', opt)}
                                            placeholder="Search account..."
                                            classNamePrefix="react-select"
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            value={line.debit || ''}
                                            onChange={(e) => handleLineChange(line.id, 'debit', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            value={line.credit || ''}
                                            onChange={(e) => handleLineChange(line.id, 'credit', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            size="small"
                                            className="text-danger"
                                            onClick={() => handleRemoveLine(line.id)}
                                            disabled={lines.length <= 2}
                                        >
                                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="link" className="p-0 mt-2 d-flex align-items-center gap-1" onClick={handleAddLine}>
                        <IconifyIcon icon="solar:add-circle-broken" /> Add Line
                    </Button>
                </div>
            </Card.Body>
            <div className="card-footer bg-light sticky-bottom shadow-sm border-top d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex gap-4">
                    <div className="text-muted fw-medium">
                        Total Debit: <span className="text-dark fs-16 ml-2 font-weight-bold">{formatAmount(totalDebit)}</span>
                    </div>
                    <div className="text-muted fw-medium">
                        Total Credit: <span className="text-dark fs-16 ml-2 font-weight-bold">{formatAmount(totalCredit)}</span>
                    </div>
                </div>
                <div>
                    {isBalanced ? (
                        <Badge bg="success" className="p-2 fs-12">
                            <IconifyIcon icon="solar:check-circle-bold" className="mr-1" /> Balanced
                        </Badge>
                    ) : (
                        <Badge bg="danger" className="p-2 fs-12">
                            <IconifyIcon icon="solar:danger-bold" className="mr-1" /> Not Balanced
                        </Badge>
                    )}
                </div>
            </div>
        </Card>
    )
}

export default VoucherForm
