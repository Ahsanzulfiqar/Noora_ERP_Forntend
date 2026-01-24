import { useField } from "formik";

const FormikToggleSwitch = ({ label, name, disabled = false }) => {
    const [field, meta, helpers] = useField({ name, type: "checkbox" });

    return (
        <div className="mb-3">
            {label && (
                <label className="form-label" style={{ fontWeight: 600 }}>
                    {label}
                </label>
            )}
            <div className="form-check form-switch mt-1">
                <input
                    type="checkbox"
                    className={`form-check-input ${meta.touched && meta.error ? "is-invalid" : ""
                        }`}
                    id={name}
                    checked={field.value}
                    disabled={disabled}
                    onChange={(e) => helpers.setValue(e.target.checked)}
                    onBlur={() => helpers.setTouched(true)}
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

export default FormikToggleSwitch;
