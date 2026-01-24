// ReusableSelect.js
import React, { useEffect, useRef } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";

const ReusableSelect = ({
  options = [],
  placeholder = "Select...",
  value,
  onChange,
  allowSearch = true,
  multiple = false,
  id,
}) => {
  const selectRef = useRef(null);
  const choicesInstance = useRef(null);

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        searchEnabled: allowSearch,
        removeItemButton: multiple,
        shouldSort: false,
        placeholder: true,
        placeholderValue: placeholder,
        itemSelectText: "",
        duplicateItemsAllowed: false,
      });

      // Update selected value
      if (value) {
        choicesInstance.current.setChoiceByValue(
          Array.isArray(value) ? value : [value]
        );
      }

      // Listen for change
      selectRef.current.addEventListener("change", (event) => {
        if (multiple) {
          const selected = Array.from(event.target.selectedOptions).map(
            (opt) => opt.value
          );
          onChange(selected);
        } else {
          onChange(event.target.value);
        }
      });
    }

    return () => {
      choicesInstance.current?.destroy();
    };
  }, [options, value, multiple]);

  return (
    <select
      id={id}
      ref={selectRef}
      multiple={multiple}
      defaultValue={value || (multiple ? [] : "")}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default ReusableSelect;
