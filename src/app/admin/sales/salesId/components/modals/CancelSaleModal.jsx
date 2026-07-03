import { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useCancelSaleMutation } from '@/services/authenticateendpoint/sales';
import ActionModal from './ActionModal';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const CancelSaleModal = ({ show, onHide, saleId }) => {
    const [cancelSale, { isLoading }] = useCancelSaleMutation();
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
            setError('Please provide a reason for cancelling this sale.');
            return;
        }
        try {
            await cancelSale({ saleId, cancelReason: trimmed }).unwrap();
            onHide();
        } catch (err) {
            setError(extractApiErrorMessage(err) || 'Failed to cancel sale');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Cancel Sale"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide} disabled={isLoading}>Keep Sale</Button>
                    <Button variant="danger" onClick={handleConfirm} disabled={isLoading || !reason.trim()}>
                        {isLoading ? 'Cancelling...' : 'Cancel Sale'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="mb-3">Are you sure you want to cancel this sale? This action cannot be undone.</p>
            <Form.Group>
                <Form.Label className="fw-semibold">Reason <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter the reason for cancelling this sale"
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

export default CancelSaleModal;
