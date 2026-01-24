import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useMarkDeliveredMutation } from '@/services/endpoints/sales';
import ActionModal from './ActionModal';

const DeliveredModal = ({ show, onHide, saleId }) => {
    const [markDelivered, { isLoading }] = useMarkDeliveredMutation();
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            await markDelivered(saleId).unwrap();
            onHide();
        } catch (err) {
            setError(err?.data?.errors?.[0]?.message || 'Failed to mark as delivered');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Mark Delivered"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="success" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Mark as Delivered'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Are you sure you want to mark this sale as delivered?</p>
        </ActionModal>
    );
};

export default DeliveredModal;
