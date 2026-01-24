import Choices from 'choices.js';
import { useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ChoicesSearchFormInput = ({
  children,
  multiple,
  className,
  onChange,
  allowInput,
  options,
  config,
  label,
  labelClassName,
  id,
  placeholder,
  ...props
}) => {
  const choicesRef = useRef(null);
  const choicesInstanceRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Update the onChange ref whenever the onChange prop changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let choicesInstance;
    if (choicesRef.current) {
      // Destroy existing instance if it exists
      if (choicesInstanceRef.current) {
        choicesInstanceRef.current.destroy();
        choicesInstanceRef.current = null;
      }

      const isArrayOptions = Array.isArray(options);
      const choicesConfig = isArrayOptions ? { ...(config || {}) } : { ...(options || {}) };

      const initialValue = props.value || props.defaultValue;

      if (isArrayOptions) {
        let finalChoices = [...options];
        if (placeholder && !multiple && !finalChoices.some(c => c.placeholder)) {
          finalChoices.unshift({
            value: '',
            label: placeholder,
            placeholder: true,
            selected: !initialValue,
          });
        }
        choicesConfig.choices = finalChoices;
      }

      choicesInstance = new Choices(choicesRef.current, {
        ...choicesConfig,
        position: 'bottom',
        placeholder: true,
        placeholderValue: placeholder,
        allowHTML: true,
        shouldSort: false,
        itemSelectText: '',
      });

      choicesInstanceRef.current = choicesInstance;

      // Set initial value
      if (initialValue) {
        choicesInstance.setChoiceByValue(initialValue);
      } else if (placeholder && !multiple) {
        choicesInstance.setChoiceByValue('');
      }

      const handleChange = e => {
        if (!(e.target instanceof HTMLSelectElement)) return;
        const value = multiple
          ? Array.from(e.target.selectedOptions).map(option => option.value)
          : e.target.value;
        console.log(`Choices [${id || props.name}] change:`, value);
        if (onChangeRef.current) {
          onChangeRef.current(value);
        }
      };

      choicesInstance.passedElement.element.addEventListener('change', handleChange);
    }

    return () => {
      if (choicesInstance) {
        choicesInstance.destroy();
        choicesInstanceRef.current = null;
      }
    };
  }, [options, config]); // Only re-run when options or config change

  // Update value without destroying the instance
  useEffect(() => {
    if (choicesInstanceRef.current && props.value !== undefined) {
      choicesInstanceRef.current.setChoiceByValue(props.value === null ? '' : props.value);
    }
  }, [props.value]);

  return (
    <>
      {label && (
        <label htmlFor={id} className={labelClassName || 'form-label'}
          style={{ fontWeight: 600 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {allowInput ? (
          <input
            ref={choicesRef}
            multiple={multiple}
            className={`${className || ''}`}
            id={id}
            data-placeholder={placeholder}
            {...props}
          />
        ) : (
          <select
            ref={choicesRef}
            multiple={multiple}
            className={`${className || ''}`}
            id={id}
            data-placeholder={placeholder}
            {...props}
          >
            {children}
          </select>
        )}
        <div className="custom-choices-icon-container">
          <KeyboardArrowDownIcon />
        </div>
      </div>
      <style>{`
        .choices__inner {
          padding-right: 35px !important;
          background-color: transparent !important;
        }
        .choices[data-type*="select-one"]:after {
          display: none !important;
        }
        .custom-choices-icon-container {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          color: rgba(0, 0, 0, 0.54);
          transition: transform 0.2s ease;
        }
        .choices.is-open ~ .custom-choices-icon-container {
          transform: translateY(-50%) rotate(180deg);
        }
        .custom-choices-icon-container svg {
          font-size: 20px;
        }
      `}</style>
    </>
  );
};

export default ChoicesSearchFormInput;