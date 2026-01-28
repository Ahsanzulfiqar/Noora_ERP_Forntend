import { useState } from "react";
import { useField } from "formik";
import IconifyIcon from "../wrappers/IconifyIcon";

const FormikPasswordField = ({
    label,
    name,
    placeholder,
    containerClass = "mb-3",
    className = "",
    ...props
}) => {
    const [field, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={containerClass}>
            {label && (
                <label className="form-label" style={{ fontWeight: 600 }}>
                    {label}
                </label>
            )}

            <div className="position-relative">
                <input
                    {...field}
                    {...props}
                    type={showPassword ? "text" : "password"}
                    className={`form-control custom-placeholder ${className} ${meta.touched && meta.error ? "is-invalid" : ""
                        }`}
                    placeholder={placeholder}
                    style={{ paddingTop: "8px", paddingBottom: "8px", paddingRight: "40px", ...props.style }}
                />

                <span
                    className="d-flex position-absolute top-50 end-0 translate-middle-y p-0 pe-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                >
                    {showPassword ? (
                        <IconifyIcon icon="bi:eye-slash-fill" height={18} width={18} />
                    ) : (
                        <IconifyIcon icon="bi:eye-fill" height={18} width={18} />
                    )}
                </span>
            </div>

            {meta.touched && meta.error && (
                <div className="invalid-feedback d-block">{meta.error}</div>
            )}
        </div>
    );
};

export default FormikPasswordField;
