import { Button, Modal, Form, Spinner } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import {
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useGetAccountsQuery,
    useGetAccountByIdQuery,
} from '@/services/authenticateendpoint/account'
import { FilterSelect } from '@/components/Filters'

const TYPE_OPTIONS = [
    { value: 'ASSET', label: 'Asset' },
    { value: 'LIABILITY', label: 'Liability' },
    { value: 'EQUITY', label: 'Equity' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
]

const extractErrorMessage = (err, fallback) =>
    err?.errors?.[0]?.message || err?.data?.errors?.[0]?.message || err?.message || fallback

const AddAccountModal = ({ show, handleClose, account }) => {
    const isEdit = !!account

    const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation()
    const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation()
    const { data: allActiveAccounts = [] } = useGetAccountsQuery({ isActive: true })
    const { data: detail, isFetching: isFetchingDetail } = useGetAccountByIdQuery(
        account?._id,
        { skip: !isEdit || !show },
    )

    const editAccount = detail || account
    const isSubmitting = isCreating || isUpdating

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Type is required'),
        code: Yup.string().required('Code is required'),
        parentId: Yup.string().nullable(),
        isActive: Yup.boolean(),
    })

    const formik = useFormik({
        initialValues: {
            name: editAccount?.name || '',
            type: editAccount?.type || 'ASSET',
            code: editAccount?.code || '',
            parentId: editAccount?.parentId || '',
            isActive: editAccount?.isActive ?? true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const payload = {
                code: values.code,
                name: values.name,
                type: values.type,
                isActive: values.isActive,
                ...(values.parentId ? { parentId: values.parentId } : {}),
            }
            try {
                if (isEdit) {
                    await updateAccount({ id: editAccount._id, data: payload }).unwrap()
                    toast.success('Account updated')
                } else {
                    await createAccount(payload).unwrap()
                    toast.success('Account created')
                }
                handleClose()
            } catch (e) {
                toast.error(extractErrorMessage(e, 'Failed to save account'))
            }
        },
    })

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Edit Account' : 'Add New Account'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isEdit && isFetchingDetail && (
                    <div className="text-muted small mb-2 d-flex align-items-center">
                        <Spinner size="sm" animation="border" className="me-2" /> Loading latest data…
                    </div>
                )}
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter account name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            isInvalid={formik.touched.name && !!formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <FilterSelect
                            value={formik.values.type}
                            onChange={(v) => {
                                formik.setFieldValue('type', v)
                                formik.setFieldValue('parentId', '')
                            }}
                            options={TYPE_OPTIONS}
                        />
                        {formik.touched.type && formik.errors.type && (
                            <div className="text-danger small mt-1">{formik.errors.type}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="code"
                            placeholder="Enter account code"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            isInvalid={formik.touched.code && !!formik.errors.code}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.code}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Parent Account (optional)</Form.Label>
                        <FilterSelect
                            value={formik.values.parentId}
                            onChange={(v) => formik.setFieldValue('parentId', v)}
                            options={[
                                { value: '', label: '— None —' },
                                ...allActiveAccounts
                                    .filter((p) => p._id !== editAccount?._id && p.type === formik.values.type)
                                    .map((p) => ({ value: p._id, label: `#${p.code} — ${p.name}` })),
                            ]}
                        />
                        <Form.Text className="text-muted">
                            Only accounts of the same type can be a parent.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="isActive-switch"
                            label="Active"
                            name="isActive"
                            checked={formik.values.isActive}
                            onChange={formik.handleChange}
                        />
                    </Form.Group>

                    {isEdit && detail?.createdAt && (
                        <div className="text-muted small mb-3">
                            Created on {new Date(detail.createdAt).toLocaleString()}
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Spinner size="sm" animation="border" className="me-1" />}
                            {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddAccountModal
