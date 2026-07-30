import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageTItle from '@/components/PageTItle'
import { Card, CardHeader, CardTitle, Table, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAccountsQuery, useGetVoucherByIdQuery } from '@/services/authenticateendpoint/account'
import { currencyLabel, formatAmount } from '@/helpers/currency'

const VoucherDetailPage = () => {
    const { id } = useParams()
    const { data, isLoading, isFetching, error } = useGetVoucherByIdQuery(id, { skip: !id })
    const { data: accounts = [] } = useGetAccountsQuery({ isActive: true })

    const accountMap = useMemo(() => {
        const map = new Map()
        accounts.forEach((account) => {
            map.set(account._id, account)
        })
        return map
    }, [accounts])

    const voucher = data?.voucher
    const lines = data?.lines || []

    const resolveAccountName = (accountId) => {
        const account = accountMap.get(accountId)
        if (!account) return accountId || 'Unknown account'
        return `${account.code ? `${account.code} - ` : ''}${account.name}`
    }

    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0)
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0)

    return (
        <>
            <PageTItle title={voucher ? `Voucher ${voucher.voucherNo}` : 'Voucher Detail'} />
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <CardTitle as="h4">{voucher?.voucherNo || 'Voucher Detail'}</CardTitle>
                                {voucher?.status && <Badge bg="success">{voucher.status}</Badge>}
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
                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    Failed to load voucher detail.
                                </Alert>
                            )}
                            {(isLoading || isFetching) && (
                                <div className="py-4 text-center">
                                    <Spinner animation="border" />
                                </div>
                            )}

                            {!isLoading && voucher && (
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <div className="mb-2">
                                            <span className="text-muted fw-medium">Date:</span>
                                            <span className="ms-2">{voucher.date}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted fw-medium">Type:</span>
                                            <span className="ms-2">{voucher.type || '-'}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted fw-medium">Source Type:</span>
                                            <span className="ms-2">{voucher.sourceType || '-'}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted fw-medium">Payment Mode:</span>
                                            <span className="ms-2">{voucher.paymentMode || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted fw-medium">Memo:</span>
                                            <span className="ms-2">{voucher.memo}</span>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Account Name</th>
                                            <th className="text-end">Debit {currencyLabel()}</th>
                                            <th className="text-end">Credit {currencyLabel()}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lines.map((line) => (
                                            <tr key={line._id || line.accountId}>
                                                <td>{resolveAccountName(line.accountId)}</td>
                                                <td className="text-end">{formatAmount(line.debit)}</td>
                                                <td className="text-end">{formatAmount(line.credit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="fw-bold bg-light">
                                        <tr>
                                            <td>Total</td>
                                            <td className="text-end">{formatAmount(totalDebit)}</td>
                                            <td className="text-end">{formatAmount(totalCredit)}</td>
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
