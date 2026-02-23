import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { useMarkOutForDeliveryMutation } from '@/services/authenticateendpoint/sales';
import { useGetAllCouriersQuery } from '@/services/authenticateendpoint/courier';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikTextArea from '@/components/formikfield/FormikTextArea';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput';
import ActionModal from './ActionModal';

const OutForDeliveryModal = ({ show, onHide, saleId }) => {
    const [markOutForDelivery, { isLoading }] = useMarkOutForDeliveryMutation();
    const { data: couriersData } = useGetAllCouriersQuery();
    const [error, setError] = useState('');

    const courierOptions = couriersData?.map(c => ({ value: c._id, label: c.name })) || [];

    const initialValues = {
        courierId: '',
        trackingNo: '',
        trackingUrl: '',
        deliveryNotes: '',
        isCOD: false
    };

    const handleSubmit = async (values) => {
        try {
            await markOutForDelivery({
                saleId,
                data: { ...values, shippedAt: new Date().toISOString() }
            }).unwrap();
            onHide();
        } catch (err) {
            setError(err?.data?.errors?.[0]?.message || 'Failed to mark as out for delivery');
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ setFieldValue }) => (
                <ActionModal
                    show={show}
                    onHide={onHide}
                    title="Mark Out for Delivery"
                    footer={
                        <>
                            <Button variant="secondary" onClick={onHide}>Cancel</Button>
                            <Button variant="primary" type="submit" form="out-for-delivery-form" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Submit'}
                            </Button>
                        </>
                    }
                >
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form id="out-for-delivery-form">
                        <div className="mb-3">
                            <Field name="courierId">
                                {({ field }) => (
                                    <ChoicesSearchFormInput
                                        label="Courier Name"
                                        labelClassName="form-label fw-bold"
                                        className="form-control"
                                        id="courierId"
                                        {...field}
                                        options={courierOptions}
                                        onChange={(value) => setFieldValue('courierId', value)}
                                        placeholder="Select Courier"
                                    />
                                )}
                            </Field>
                        </div>
                        <FormikTextField
                            label="Tracking Number"
                            name="trackingNo"
                            placeholder="Enter Tracking Number"
                        />
                        <FormikTextField
                            label="Tracking URL"
                            name="trackingUrl"
                            placeholder="Enter Tracking URL"
                        />
                        <FormikTextArea
                            label="Notes"
                            name="deliveryNotes"
                            placeholder="Enter Delivery Notes"
                            rows={3}
                        />
                        <div className="mb-3 form-check">
                            <Field
                                type="checkbox"
                                name="isCOD"
                                id="isCOD"
                                className="form-check-input"
                            />
                            <label htmlFor="isCOD" className="form-check-label fw-bold">Is Cash on Delivery (COD)?</label>
                        </div>
                    </Form>
                </ActionModal>
            )}
        </Formik>
    );
};

export default OutForDeliveryModal;
