import { useState } from 'react'
import { Card, CardHeader, CardTitle, Table, Button, Form, Row, Col, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import IconButton from '@mui/material/IconButton'
import AddAccountModal from './AddAccountModal'

const INITIAL_ACCOUNTS = [
    { id: 1, name: 'Cash in Hand', type: 'Asset', code: '1001', isActive: true },
    { id: 2, name: 'Bank Account', type: 'Asset', code: '1002', isActive: true },
    { id: 3, name: 'Accounts Receivable', type: 'Asset', code: '1101', isActive: true },
    { id: 4, name: 'Accounts Payable', type: 'Liability', code: '2001', isActive: true },
    { id: 5, name: 'Sales Revenue', type: 'Revenue', code: '4001', isActive: true },
    { id: 6, name: 'Office Rent', type: 'Expense', code: '5001', isActive: true },
]

const AccountList = () => {
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)

    const handleOpenModal = (account = null) => {
        setSelectedAccount(account)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setSelectedAccount(null)
        setShowModal(false)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            setAccounts(accounts.filter((acc) => acc.id !== id))
        }
    }

    const filteredAccounts = accounts.filter((acc) => {
        const matchesSearch = acc.name.toLowerCase().includes(search.toLowerCase()) || acc.code.includes(search)
        const matchesType = typeFilter === '' || acc.type === typeFilter
        return matchesSearch && matchesType
    })

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <Badge bg="success-subtle" className="text-success">Active</Badge>
        ) : (
            <Badge bg="danger-subtle" className="text-danger">Inactive</Badge>
        )
    }

    return (
        <>
            <Card className="mb-4">
                <CardHeader className="d-flex justify-content-between align-items-center gap-1">
                    <CardTitle as={'h4'} className="flex-grow-1">
                        Chart of Accounts
                    </CardTitle>
                    <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm">
                            <IconifyIcon icon="solar:refresh-broken" className="me-1" /> Seed Defaults
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
                            <IconifyIcon icon="solar:add-circle-broken" className="me-1" /> Add Account
                        </Button>
                    </div>
                </CardHeader>
                <Card.Body>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Search by name or code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="">All Types</option>
                                <option value="Asset">Asset</option>
                                <option value="Liability">Liability</option>
                                <option value="Equity">Equity</option>
                                <option value="Revenue">Revenue</option>
                                <option value="Expense">Expense</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table className="align-middle mb-0 table-hover table-centered">
                            <thead className="bg-light-subtle text-muted text-uppercase small">
                                <tr>
                                    <th className="px-4">Code</th>
                                    <th>Account Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th className="text-end px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.map((account) => (
                                    <tr key={account.id}>
                                        <td className="px-4 fw-medium">#{account.code}</td>
                                        <td>{account.name}</td>
                                        <td>{account.type}</td>
                                        <td>{getStatusBadge(account.isActive)}</td>
                                        <td className="text-end px-4">
                                            <div className="d-flex justify-content-end gap-1">
                                                <IconButton size="small" className="btn btn-soft-primary btn-sm" onClick={() => handleOpenModal(account)}>
                                                    <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                                                </IconButton>
                                                <IconButton size="small" className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(account.id)}>
                                                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAccounts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <h5 className="text-muted">No accounts found.</h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <AddAccountModal
                show={showModal}
                handleClose={handleCloseModal}
                account={selectedAccount}
            />
        </>
    )
}

export default AccountList
