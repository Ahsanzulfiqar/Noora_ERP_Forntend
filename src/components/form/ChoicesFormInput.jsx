import Choices from 'choices.js';
import { useEffect, useRef } from 'react';
const ChoicesFormInput = ({
  children,
  multiple,
  className,
  onChange,
  allowInput,
  options,
  ...props
}) => {
  const choicesRef = useRef(null);
  const choicesInstanceRef = useRef(null);

  useEffect(() => {
    if (choicesRef.current) {
      // Destroy existing instance if it exists
      if (choicesInstanceRef.current) {
        choicesInstanceRef.current.destroy();
      }

      // Create new Choices instance
      const choices = new Choices(choicesRef.current, {
        ...options,
        placeholder: true,
        allowHTML: true,
        shouldSort: false
      });

      choicesInstanceRef.current = choices;

      choices.passedElement.element.addEventListener('change', e => {
        if (!(e.target instanceof HTMLSelectElement)) return;
        if (onChange) {
          onChange(e.target.value);
        }
      });
    }

    // Cleanup function
    return () => {
      if (choicesInstanceRef.current) {
        choicesInstanceRef.current.destroy();
        choicesInstanceRef.current = null;
      }
    };
  }, [children, options, onChange]); // Re-run when children (options) change
  return allowInput ? <input ref={choicesRef} multiple={multiple} className={className} {...props} /> : <select ref={choicesRef} multiple={multiple} className={className} {...props}>
    {children}
  </select>;
};
export default ChoicesFormInput;