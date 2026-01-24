import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useConfirmSaleMutation } from '@/services/endpoints/sales';
import ActionModal from './ActionModal';

const ConfirmSaleModal = ({ show, onHide, saleId }) => {
    const [confirmSale, { isLoading }] = useConfirmSaleMutation();
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            await confirmSale(saleId).unwrap();
            onHide();
        } catch (err) {
            setError(err?.data?.errors?.[0]?.message || 'Failed to confirm sale');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Confirm Sale"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="success" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Confirming...' : 'Confirm Sale'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Are you sure you want to confirm this sale?</p>
        </ActionModal>
    );
};

export default ConfirmSaleModal;
