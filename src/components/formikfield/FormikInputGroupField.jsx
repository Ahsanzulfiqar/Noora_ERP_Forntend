import { useField } from "formik";

const FormikInputGroupField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  iconClass = "",
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label fw-semibold">
          {label}
        </label>
      )}

      <div className="input-group">
        {icon && (
          <span className={`input-group-text ${iconClass}`}>
            {icon}
          </span>
        )}

        <input
          {...field}
          id={name}
          type={type}
          className={`form-control ${
            meta.touched && meta.error ? "is-invalid" : ""
          }`}
          placeholder={placeholder}
          style={{ paddingTop: "8px", paddingBottom: "8px" }}
        />
      </div>

      {meta.touched && meta.error && (
        <div className="invalid-feedback d-block">
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default FormikInputGroupField;
