import Select from "react-select";
import { useField } from "formik";

const FormikSearchSelect = ({ label, name, options = [], onChange, ...props }) => {
  const [field, meta, helpers] = useField(name);

  // Find selected option based on value (supports number, boolean, string)
  const selectedOption =
    options.find(opt => opt.value === field.value) || null;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "8px", // ✅ control border radius
      borderColor:
        meta.touched && meta.error
          ? "#dc3545"
          : state.isFocused
            ? "#86b7fe"
            : base.borderColor,
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13,110,253,.25)" : "none",
      "&:hover": {
        borderColor:
          meta.touched && meta.error ? "#dc3545" : "#86b7fe",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px", // ✅ dropdown border radius
      overflow: "hidden",
    }),
  };

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}

      <Select
        options={options}
        value={selectedOption}
        onChange={(option) => {
          const value = option ? option.value : "";
          helpers.setValue(value);
          if (onChange) {
            onChange(value);
          }
        }}
        onBlur={() => helpers.setTouched(true)}
        isClearable
        isSearchable
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        styles={customStyles}
        {...props}
      />

      {meta.touched && meta.error && (
        <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default FormikSearchSelect;
