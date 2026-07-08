import { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useReturnSaleMutation } from '@/services/authenticateendpoint/sales';
import ActionModal from './ActionModal';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const ReturnSaleModal = ({ show, onHide, saleId }) => {
    const [returnSale, { isLoading }] = useReturnSaleMutation();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!show) {
            setReason('');
            setError('');
        }
    }, [show]);

    const handleConfirm = async () => {
        const trimmed = reason.trim();
        if (!trimmed) {
            setError('Please provide a reason for returning this sale.');
            return;
        }
        try {
            await returnSale({ saleId, returnReason: trimmed }).unwrap();
            onHide();
        } catch (err) {
            setError(extractApiErrorMessage(err) || 'Failed to return sale');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Return Sale"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide} disabled={isLoading}>Cancel</Button>
                    <Button variant="warning" onClick={handleConfirm} disabled={isLoading || !reason.trim()}>
                        {isLoading ? 'Processing...' : 'Confirm Return'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="mb-3">Are you sure you want to return this sale?</p>
            <Form.Group>
                <Form.Label className="fw-semibold">Reason <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter the reason for returning this sale"
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        if (error) setError('');
                    }}
                    autoFocus
                />
            </Form.Group>
        </ActionModal>
    );
};

export default ReturnSaleModal;
