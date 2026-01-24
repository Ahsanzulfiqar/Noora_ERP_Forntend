import { Modal } from 'react-bootstrap';

const ActionModal = ({ show, onHide, title, children, footer }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
);

export default ActionModal;
