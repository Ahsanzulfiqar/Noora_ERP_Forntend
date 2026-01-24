import { Modal, Button } from 'react-bootstrap'

const DeleteConfirmModal = ({
    show,
    onConfirm,
    onCancel,
    title = 'Confirm Action',
    message = 'Are you sure?',
    confirmText = 'Yes',
    cancelText = 'Cancel',
    confirmVariant = 'danger',
    loading = false,
}) => {
    return (
        <Modal show={show} onHide={onCancel} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-0">{message}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    {cancelText}
                </Button>

                <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
                    {loading ? 'Processing...' : confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmModal
