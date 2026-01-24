import { useField } from "formik";

const FormikCheckbox = ({ label, name, disabled = false }) => {
  const [field, meta, helpers] = useField({ name, type: "checkbox" });

  return (
    <div className="mb-3">
      <div className="form-check">
        <input
          type="checkbox"
          className={`form-check-input ${
            meta.touched && meta.error ? "is-invalid" : ""
          }`}
          id={name}
          checked={field.value}
          disabled={disabled}
          onChange={(e) => helpers.setValue(e.target.checked)}
          onBlur={() => helpers.setTouched(true)}
        />

        {label && (
          <label className="form-check-label" htmlFor={name}>
            {label}
          </label>
        )}
      </div>

      {meta.touched && meta.error && (
        <div className="invalid-feedback d-block">
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default FormikCheckbox;
