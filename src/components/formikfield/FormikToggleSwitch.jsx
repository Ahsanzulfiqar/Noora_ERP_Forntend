import { useField } from "formik";

const FormikToggleSwitch = ({ label, name, disabled = false, inline = false }) => {
    const [field, meta, helpers] = useField({ name, type: "checkbox" });

    return (
        <div className="mb-3">
            {label && !inline && (
                <label className="form-label" style={{ fontWeight: 600 }}>
                    {label}
                </label>
            )}
            <div className={`form-check form-switch ${inline ? "d-flex align-items-center justify-content-between mt-0 w-100 ps-0" : "mt-1"}`}>
                {label && inline && (
                    <label className="form-label mb-0" htmlFor={name} style={{ fontWeight: 600 }}>
                        {label}
                    </label>
                )}
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
