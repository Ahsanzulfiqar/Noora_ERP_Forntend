import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useCancelSaleMutation } from '@/services/endpoints/sales';
import ActionModal from './ActionModal';

const CancelSaleModal = ({ show, onHide, saleId }) => {
    const [cancelSale, { isLoading }] = useCancelSaleMutation();
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            await cancelSale(saleId).unwrap();
            onHide();
        } catch (err) {
            setError(err?.data?.errors?.[0]?.message || 'Failed to cancel sale');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Cancel Sale"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>Keep Sale</Button>
                    <Button variant="danger" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Cancelling...' : 'Cancel Sale'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Are you sure you want to cancel this sale? This action cannot be undone.</p>
        </ActionModal>
    );
};

export default CancelSaleModal;
