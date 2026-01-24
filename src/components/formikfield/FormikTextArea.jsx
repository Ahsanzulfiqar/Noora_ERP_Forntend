import { useField } from "formik";

const FormikTextArea = ({
  label,
  name,
  placeholder,
  rows = 4,
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}

      <textarea
        {...field}
        rows={rows}
        className={`form-control custom-placeholder ${meta.touched && meta.error ? "is-invalid" : ""
          }`}
        placeholder={placeholder}
        style={{ paddingTop: "8px", paddingBottom: "8px" }}
      />

      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikTextArea;
