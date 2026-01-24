import { useField } from "formik";

const FormikTextField = ({ label, name, type = "text", placeholder, containerClass = "mb-3", className = "", ...props }) => {
  const [field, meta] = useField(name);

  return (
    <div className={containerClass}>
      {label && (
        <label className="form-label" style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}


      <input
        {...field}
        {...props}
        type={type}
        className={`form-control custom-placeholder ${className} ${meta.touched && meta.error ? "is-invalid" : ""
          }`}
        placeholder={placeholder}
        style={{ paddingTop: "8px", paddingBottom: "8px", ...props.style }} // compact height
      />

      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikTextField;
