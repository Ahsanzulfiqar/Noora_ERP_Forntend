import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useUpdateSaleMutation } from '@/services/authenticateendpoint/sales';
import ActionModal from './ActionModal';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const DraftSaleModal = ({ show, onHide, saleId }) => {
    const [updateSale, { isLoading }] = useUpdateSaleMutation();
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        try {
            await updateSale({
                id: saleId,
                data: { status: 'DRAFT' }
            }).unwrap();
            onHide();
        } catch (err) {
            setError(extractApiErrorMessage(err) || 'Failed to mark as draft');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Mark as Draft"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Mark as Draft'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Are you sure you want to mark this sale as draft?</p>
        </ActionModal>
    );
};

export default DraftSaleModal;
