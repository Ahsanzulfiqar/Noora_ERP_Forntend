import { useEffect, useState } from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import ActionModal from './ActionModal'
import FormikTextArea from '@/components/formikfield/FormikTextArea'
import FormikTextField from '@/components/formikfield/FormikTextField'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import { formatCurrency } from '@/helpers/currency'
import { useUpdateCourierChargesMutation } from '@/services/authenticateendpoint/sales'

const EditCourierChargesModal = ({ show, onHide, sale }) => {
  const [updateCourierCharges, { isLoading }] = useUpdateCourierChargesMutation()
  const [error, setError] = useState('')
  const courier = sale?.courier
  const charges = courier?.charges

  useEffect(() => {
    if (show) setError('')
  }, [show])

  const initialValues = {
    remoteAreaStatus: courier?.remoteAreaStatus || 'NON_REMOTE',
    remoteCharge: charges?.remoteCharge ?? 0,
    chargeNote: courier?.chargeNote || '',
  }

  const handleSubmit = async (values) => {
    try {
      await updateCourierCharges({
        saleId: sale._id,
        data: {
          remoteAreaStatus: values.remoteAreaStatus,
          remoteCharge: Number(values.remoteCharge) || 0,
          chargeNote: values.chargeNote.trim(),
        },
      }).unwrap()
      toast.success('Courier charges updated successfully')
      onHide()
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError) || 'Failed to update courier charges')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={Yup.object({
        remoteAreaStatus: Yup.string().oneOf(['NON_REMOTE', 'REMOTE']).required('Remote area status is required'),
        remoteCharge: Yup.number().min(0, 'Remote charge cannot be negative').required('Remote charge is required'),
        chargeNote: Yup.string().max(500, 'Charge note must be 500 characters or less'),
      })}
      onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <ActionModal
          show={show}
          onHide={onHide}
          title="Edit Courier Charges"
          footer={
            <>
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button type="submit" form="courier-charges-form" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          }>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="p-3 bg-light rounded mb-3">
            <Row className="g-2 small">
              <Col xs={6}>
                <span className="text-muted">Base Charge</span>
                <div className="fw-semibold">{formatCurrency(charges?.baseCharge)}</div>
              </Col>
              <Col xs={6}>
                <span className="text-muted">COD Charge</span>
                <div className="fw-semibold">{formatCurrency(charges?.codCharge)}</div>
              </Col>
              <Col xs={6}>
                <span className="text-muted">Return Charge</span>
                <div className="fw-semibold">{formatCurrency(charges?.returnCharge)}</div>
              </Col>
              <Col xs={6}>
                <span className="text-muted">Current Total</span>
                <div className="fw-semibold text-primary">{formatCurrency(charges?.totalCourierCharge)}</div>
              </Col>
            </Row>
          </div>
          <Form id="courier-charges-form">
            <div className="mb-3">
              <label htmlFor="remoteAreaStatus" className="form-label fw-bold">
                Remote Area Status
              </label>
              <Field
                as="select"
                id="remoteAreaStatus"
                name="remoteAreaStatus"
                className="form-select"
                onChange={(event) => {
                  const value = event.target.value
                  setFieldValue('remoteAreaStatus', value)
                  if (value === 'NON_REMOTE') setFieldValue('remoteCharge', 0)
                }}>
                <option value="NON_REMOTE">Non-remote</option>
                <option value="REMOTE">Remote</option>
              </Field>
            </div>
            <FormikTextField
              type="number"
              min="0"
              step="0.01"
              label="Remote Charge"
              name="remoteCharge"
              placeholder="0.00"
              disabled={values.remoteAreaStatus !== 'REMOTE'}
            />
            <FormikTextArea label="Charge Note" name="chargeNote" placeholder="Add a note about this charge" rows={3} />
          </Form>
        </ActionModal>
      )}
    </Formik>
  )
}

export default EditCourierChargesModal
