import React, { useState } from 'react';
import styles from './InputField.module.css'
const InputField = ({
  label,
  placeholder,
  value,
  name,
  onChange,
  type,
  required,
  pattern,
  errorMessage,
  children
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={styles.inputField}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        id={name}
        onChange={onChange}
        required={required}
        pattern={pattern}
        className={`${styles.input} ${isFocused && styles.focused}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default InputField;
