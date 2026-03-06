import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const AddAccountModal = ({ show, handleClose, account }) => {
    const isEdit = !!account

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Type is required'),
        code: Yup.string().required('Code is required'),
        isActive: Yup.boolean(),
    })

    const formik = useFormik({
        initialValues: {
            name: account?.name || '',
            type: account?.type || 'Asset',
            code: account?.code || '',
            isActive: account?.isActive ?? true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log('Account values:', values)
            handleClose()
        },
    })

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Edit Account' : 'Add New Account'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        <Form.Select
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            isInvalid={formik.touched.type && !!formik.errors.type}
                        >
                            <option value="Asset">Asset</option>
                            <option value="Liability">Liability</option>
                            <option value="Equity">Equity</option>
                            <option value="Revenue">Revenue</option>
                            <option value="Expense">Expense</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
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
                        <Form.Check
                            type="switch"
                            id="isActive-switch"
                            label="Active"
                            name="isActive"
                            checked={formik.values.isActive}
                            onChange={formik.handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddAccountModal
