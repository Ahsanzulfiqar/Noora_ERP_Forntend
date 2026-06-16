import { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, Table, Button, Form, Row, Col, Badge, Spinner, ButtonGroup } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import AddAccountModal from './AddAccountModal'
import {
    useGetAccountsQuery,
    useGetAccountTreeQuery,
    useSeedDefaultAccountsMutation,
    useDisableAccountMutation,
    useEnableAccountMutation,
    useDeleteAccountMutation,
} from '@/services/authenticateendpoint/account'

const TYPE_OPTIONS = [
    { value: 'ASSET', label: 'Asset' },
    { value: 'LIABILITY', label: 'Liability' },
    { value: 'EQUITY', label: 'Equity' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
]

const typeLabel = (t) => TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t

const extractErrorMessage = (err, fallback) =>
    err?.errors?.[0]?.message || err?.data?.errors?.[0]?.message || err?.message || fallback

const AccountList = () => {
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('active')
    const [viewMode, setViewMode] = useState('list')
    const [showModal, setShowModal] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [menuAnchor, setMenuAnchor] = useState(null)
    const [menuAccount, setMenuAccount] = useState(null)

    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput.trim()), 300)
        return () => clearTimeout(t)
    }, [searchInput])

    const queryArgs = {
        ...(search && { search }),
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter === 'active' && { isActive: true }),
        ...(statusFilter === 'inactive' && { isActive: false }),
    }

    const { data: accounts = [], isLoading, isFetching, error } = useGetAccountsQuery(queryArgs)
    const { data: allAccounts = [] } = useGetAccountsQuery({})
    const { data: tree = [], isLoading: isTreeLoading, error: treeError } =
        useGetAccountTreeQuery(undefined, { skip: viewMode !== 'tree' })
    const [seedDefaults, { isLoading: isSeeding }] = useSeedDefaultAccountsMutation()
    const [disableAccount, { isLoading: isDisabling }] = useDisableAccountMutation()
    const [enableAccount, { isLoading: isEnabling }] = useEnableAccountMutation()
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation()

    const parentLookup = useMemo(() => {
        const map = {}
        for (const a of allAccounts) map[a._id] = a
        return map
    }, [allAccounts])

    const handleOpenModal = (account = null) => {
        setSelectedAccount(account)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setSelectedAccount(null)
        setShowModal(false)
    }

    const handleSeed = async () => {
        if (!window.confirm('Seed default accounts? Existing accounts will not be removed.')) return
        try {
            await seedDefaults().unwrap()
            toast.success('Default accounts seeded')
        } catch (e) {
            toast.error(extractErrorMessage(e, 'Failed to seed defaults'))
        }
    }

    const handleDisable = async (id) => {
        try {
            await disableAccount(id).unwrap()
            toast.success('Account disabled')
        } catch (e) {
            toast.error(extractErrorMessage(e, 'Failed to disable account'))
        }
    }

    const handleEnable = async (id) => {
        try {
            await enableAccount(id).unwrap()
            toast.success('Account enabled')
        } catch (e) {
            toast.error(extractErrorMessage(e, 'Failed to enable account'))
        }
    }

    const openRowMenu = (e, account) => {
        setMenuAnchor(e.currentTarget)
        setMenuAccount(account)
    }

    const closeRowMenu = () => {
        setMenuAnchor(null)
        setMenuAccount(null)
    }

    const handleHardDelete = async (acc) => {
        if (!acc) return
        const msg = `Permanently delete "${acc.name}" (#${acc.code})?\n\nThis cannot be undone. If the account has transactions, the backend will reject it — use Disable instead.`
        if (!window.confirm(msg)) return
        try {
            await deleteAccount(acc._id).unwrap()
            toast.success('Account deleted')
        } catch (e) {
            toast.error(extractErrorMessage(e, 'Failed to delete account'))
        }
    }

    const handleMenuDisable = () => {
        const acc = menuAccount
        if (!acc) return
        closeRowMenu()
        handleDisable(acc._id)
    }

    const handleMenuEnable = () => {
        const acc = menuAccount
        if (!acc) return
        closeRowMenu()
        handleEnable(acc._id)
    }

    const getStatusBadge = (isActive) =>
        isActive ? (
            <Badge bg="success-subtle" className="text-success">Active</Badge>
        ) : (
            <Badge bg="danger-subtle" className="text-danger">Inactive</Badge>
        )

    const renderParent = (account) => {
        if (!account.parentId) return <span className="text-muted">—</span>
        const parent = parentLookup[account.parentId]
        return parent ? <span>#{parent.code} — {parent.name}</span> : <span className="text-muted">—</span>
    }

    const renderTreeNodes = (nodes, depth = 0) =>
        nodes.flatMap((node) => [
            <tr key={node._id}>
                <td className="px-4 fw-medium" style={{ paddingLeft: `${16 + depth * 28}px` }}>
                    {depth > 0 && <span className="text-muted me-2">└─</span>}
                    {node.code}
                </td>
                <td>{node.name}</td>
                <td>{typeLabel(node.type)}</td>
                <td className="text-end px-4">
                    <IconButton
                        size="small"
                        className="btn btn-soft-primary btn-sm"
                        onClick={() => handleOpenModal(node)}>
                        <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                    </IconButton>
                </td>
            </tr>,
            ...(node.children?.length ? renderTreeNodes(node.children, depth + 1) : []),
        ])

    const showSpinnerRow = isLoading
    const showErrorRow = !isLoading && error
    const showEmptyRow = !isLoading && !error && accounts.length === 0
    const visibleCount = accounts.length

    return (
        <>
            <Card className="mb-4">
                <CardHeader className="d-flex justify-content-between align-items-center gap-1 border-bottom">
                    <div>
                        <h4 className="mb-1">Chart of Accounts</h4>
                        <p className="text-muted mb-0 small">All accounts in your chart</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <ButtonGroup size="sm">
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                                onClick={() => setViewMode('list')}>
                                <IconifyIcon icon="solar:list-broken" className="me-1" /> List
                            </Button>
                            <Button
                                variant={viewMode === 'tree' ? 'primary' : 'outline-primary'}
                                onClick={() => setViewMode('tree')}>
                                <IconifyIcon icon="solar:branching-paths-down-broken" className="me-1" /> Tree
                            </Button>
                        </ButtonGroup>
                        <Button variant="outline-primary" size="sm" onClick={handleSeed} disabled={isSeeding}>
                            {isSeeding ? (
                                <Spinner size="sm" animation="border" className="me-1" />
                            ) : (
                                <IconifyIcon icon="solar:refresh-broken" className="me-1" />
                            )}
                            Seed Defaults
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
                            <IconifyIcon icon="solar:add-circle-broken" className="me-1" /> New Account
                        </Button>
                    </div>
                </CardHeader>
                {viewMode === 'list' && (
                    <Card.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search account by name or code..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                    <option value="">All Types</option>
                                    {TYPE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="">All Status</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card.Body>
                )}
            </Card>

            {viewMode === 'list' ? (
                <Card>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table className="align-middle mb-0 table-hover table-centered">
                                <thead className="bg-light-subtle text-muted text-uppercase small">
                                    <tr>
                                        <th className="px-4">Code</th>
                                        <th>Account Name</th>
                                        <th>Type</th>
                                        <th>Parent Account</th>
                                        <th>Status</th>
                                        <th className="text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showSpinnerRow && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5">
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Loading accounts...
                                            </td>
                                        </tr>
                                    )}
                                    {showErrorRow && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-danger">
                                                {extractErrorMessage(error, 'Failed to load accounts')}
                                            </td>
                                        </tr>
                                    )}
                                    {!showSpinnerRow && !showErrorRow && accounts.map((account) => (
                                        <tr key={account._id}>
                                            <td className="px-4 fw-medium">{account.code}</td>
                                            <td>{account.name}</td>
                                            <td>{typeLabel(account.type)}</td>
                                            <td>{renderParent(account)}</td>
                                            <td>{getStatusBadge(account.isActive)}</td>
                                            <td className="text-end px-4">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <IconButton
                                                        size="small"
                                                        className="btn btn-soft-primary btn-sm"
                                                        onClick={() => handleOpenModal(account)}>
                                                        <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        className="btn btn-soft-danger btn-sm"
                                                        disabled={isDeleting}
                                                        onClick={() => handleHardDelete(account)}>
                                                        <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        className="btn btn-soft-secondary btn-sm"
                                                        onClick={(e) => openRowMenu(e, account)}>
                                                        <IconifyIcon icon="solar:menu-dots-broken" className="align-middle fs-18" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {showEmptyRow && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5">
                                                <h5 className="text-muted">No accounts found.</h5>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                    {!showSpinnerRow && !showErrorRow && visibleCount > 0 && (
                        <Card.Footer className="d-flex justify-content-between align-items-center text-muted small">
                            <span>Showing 1 to {visibleCount} of {visibleCount} accounts</span>
                            {isFetching && <span>Refreshing…</span>}
                        </Card.Footer>
                    )}
                </Card>
            ) : (
                <Card>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table className="align-middle mb-0 table-hover">
                                <thead className="bg-light-subtle text-muted text-uppercase small">
                                    <tr>
                                        <th className="px-4">Code</th>
                                        <th>Account Name</th>
                                        <th>Type</th>
                                        <th className="text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isTreeLoading && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Loading tree...
                                            </td>
                                        </tr>
                                    )}
                                    {!isTreeLoading && treeError && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-danger">
                                                {extractErrorMessage(treeError, 'Failed to load tree')}
                                            </td>
                                        </tr>
                                    )}
                                    {!isTreeLoading && !treeError && tree.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <h5 className="text-muted">No accounts found.</h5>
                                            </td>
                                        </tr>
                                    )}
                                    {!isTreeLoading && !treeError && renderTreeNodes(tree)}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeRowMenu}>
                {menuAccount?.isActive ? (
                    <MenuItem onClick={handleMenuDisable} disabled={isDisabling}>
                        <IconifyIcon icon="solar:eye-closed-broken" className="me-2 fs-18" />
                        Disable account
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleMenuEnable} disabled={isEnabling}>
                        <IconifyIcon icon="solar:restart-broken" className="me-2 fs-18 text-success" />
                        Enable account
                    </MenuItem>
                )}
            </Menu>

            <AddAccountModal
                show={showModal}
                handleClose={handleCloseModal}
                account={selectedAccount}
            />
        </>
    )
}

export default AccountList
