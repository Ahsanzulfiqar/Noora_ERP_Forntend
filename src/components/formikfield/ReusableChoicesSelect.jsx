import React from "react";
import ChoicesFormInput from '@/components/form/ChoicesFormInput';

const ReusableChoicesSelect = ({
  id,
  label,
  options = [],
  placeholder = "Select option",
  className = "form-control",
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label" style={{ fontWeight: 600 }}> 
          {label}
        </label>
      )}

      <ChoicesFormInput
        id={id}
        className={className}
        data-placeholder={placeholder}
        {...rest}
      >
        <option value="">{placeholder}</option>

        {options.map((opt, index) => (
          <option key={index} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </ChoicesFormInput>
    </div>
  );
};

export default ReusableChoicesSelect;
