/* eslint-disable react/prop-types */
import { useField } from 'formik'
import { Form } from 'react-bootstrap'

const FormikDateField = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <Form.Group className="mb-3">
      {label && (
        <label className="form-label" style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}

      <Form.Control
        type="date"
        {...field}
        {...props}
        isInvalid={meta.touched && meta.error}
      />

      {meta.touched && meta.error && (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}

export default FormikDateField
