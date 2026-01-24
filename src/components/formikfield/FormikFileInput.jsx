import { useField } from 'formik'

const FormikFileInput = ({ name, label, multiple = false }) => {
  const [field, meta, helpers] = useField(name)

  const handleChange = (e) => {
    const files = e.target.files
    if (multiple) {
      helpers.setValue([...files])
    } else {
      helpers.setValue(files[0])
    }
  }

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}
      <input type="file" className="form-control" onChange={handleChange} multiple={multiple} />

      {meta.touched && meta.error ? <div className="text-danger small mt-1">{meta.error}</div> : null}
    </div>
  )
}

export default FormikFileInput
