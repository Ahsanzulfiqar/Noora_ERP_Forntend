import { useParams, Link } from 'react-router-dom'
import PageTItle from '@/components/PageTItle'
import { Card, CardHeader, CardTitle, Table, Row, Col, Badge, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const VoucherDetailPage = () => {
    const { id } = useParams()

    // Mock detail data
    const voucher = {
        voucherNo: 'JV-2026-001',
        date: '2026-02-20',
        memo: 'Salary payment for Feb',
        status: 'POSTED',
        lines: [
            { id: 1, account: '1001 - Cash in Hand', debit: 0, credit: 50000 },
            { id: 2, account: '5001 - Office Rent', debit: 50000, credit: 0 },
        ],
    }

    const totalDebit = voucher.lines.reduce((sum, line) => sum + line.debit, 0)
    const totalCredit = voucher.lines.reduce((sum, line) => sum + line.credit, 0)

    return (
        <>
            <PageTItle title={`Voucher ${voucher.voucherNo}`} />
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <CardTitle as="h4">{voucher.voucherNo}</CardTitle>
                                <Badge bg="success">{voucher.status}</Badge>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-primary" size="sm">
                                    <IconifyIcon icon="solar:printer-broken" className="mr-1" /> Print
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                    Void
                                </Button>
                            </div>
                        </CardHeader>
                        <Card.Body>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <div className="mb-2">
                                        <span className="text-muted fw-medium">Date:</span>
                                        <span className="ms-2">{voucher.date}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted fw-medium">Memo:</span>
                                        <span className="ms-2">{voucher.memo}</span>
                                    </div>
                                </Col>
                            </Row>

                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Account Name</th>
                                            <th className="text-end">Debit</th>
                                            <th className="text-end">Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voucher.lines.map((line) => (
                                            <tr key={line.id}>
                                                <td>{line.account}</td>
                                                <td className="text-end">{line.debit.toFixed(2)}</td>
                                                <td className="text-end">{line.credit.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="fw-bold bg-light">
                                        <tr>
                                            <td>Total</td>
                                            <td className="text-end">{totalDebit.toFixed(2)}</td>
                                            <td className="text-end">{totalCredit.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/accounts/vouchers" className="btn btn-outline-secondary btn-sm">
                                Back to List
                            </Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default VoucherDetailPage
