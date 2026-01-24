import { useField } from "formik";

const FormikRadioGroup = ({ label, name, options, containerClass = "mb-3", labelClassName = "form-label fw-bold", ...props }) => {
    const [field, meta, helpers] = useField(name);

    return (
        <div className={containerClass}>
            {label && (
                <p className={labelClassName}>
                    {label}
                </p>
            )}
            <div className="d-flex gap-3 align-items-center">
                {options.map((option) => (
                    <div className="form-check" key={option.value.toString()}>
                        <input
                            {...props}
                            className="form-check-input"
                            type="radio"
                            name={name}
                            id={`${name}_${option.value}`}
                            checked={field.value === option.value}
                            onChange={() => helpers.setValue(option.value)}
                        />
                        <label className="form-check-label" htmlFor={`${name}_${option.value}`}>
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {meta.touched && meta.error && (
                <div className="text-danger small mt-1">{meta.error}</div>
            )}
        </div>
    );
};

export default FormikRadioGroup;
