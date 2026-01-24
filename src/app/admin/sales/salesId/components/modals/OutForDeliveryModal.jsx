import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useMarkOutForDeliveryMutation } from '@/services/endpoints/sales';
import ActionModal from './ActionModal';

const OutForDeliveryModal = ({ show, onHide, saleId }) => {
    const [markOutForDelivery, { isLoading }] = useMarkOutForDeliveryMutation();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        courierName: '',
        trackingNo: '',
        trackingUrl: '',
        deliveryNotes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await markOutForDelivery({
                saleId,
                data: { ...formData, shippedAt: new Date().toISOString() }
            }).unwrap();
            onHide();
        } catch (err) {
            setError(err?.data?.errors?.[0]?.message || 'Failed to mark as out for delivery');
        }
    };

    return (
        <ActionModal
            show={show}
            onHide={onHide}
            title="Mark Out for Delivery"
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Submit'}
                    </Button>
                </>
            }
        >
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Courier Name</Form.Label>
                    <Form.Control
                        type="text"
                        required
                        value={formData.courierName}
                        onChange={e => setFormData({ ...formData, courierName: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tracking Number</Form.Label>
                    <Form.Control
                        type="text"
                        required
                        value={formData.trackingNo}
                        onChange={e => setFormData({ ...formData, trackingNo: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tracking URL</Form.Label>
                    <Form.Control
                        type="url"
                        value={formData.trackingUrl}
                        onChange={e => setFormData({ ...formData, trackingUrl: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={formData.deliveryNotes}
                        onChange={e => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    />
                </Form.Group>
            </Form>
        </ActionModal>
    );
};

export default OutForDeliveryModal;
