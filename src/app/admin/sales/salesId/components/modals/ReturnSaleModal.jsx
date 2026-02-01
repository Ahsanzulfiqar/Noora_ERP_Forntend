import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useReturnSaleMutation } from '@/services/authenticateendpoint/sales';
import ActionModal from './ActionModal';

const ReturnSaleModal = ({ show, onHide, saleId }) => {
    const [returnSale, { isLoading }] = useReturnSaleMutation();
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            await returnSale(saleId).unwrap();
            onHide();
        } catch (err) {
            setError(err?.data?.errors?.[0]?.message || 'Failed to return sale');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Return Sale"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="warning" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Confirm Return'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Are you sure you want to return this sale?</p>
        </ActionModal>
    );
};

export default ReturnSaleModal;
