import React, { useId } from 'react';
import styles from './Select.module.css'; 

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  errorMessage?: string;
  
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  errorMessage,
  id, 
  className, 
  ...props 
}) => {
  const generatedId = useId(); 
  const selectId = id || generatedId;

  const wrapperClasses = `
    ${styles.selectWrapper}
    ${errorMessage ? styles.hasError : ''}
    ${className || ''}
  `;

  return (
    <div className={wrapperClasses.trim()}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.selectContainer}> {}
        <select
          id={selectId}
          className={styles.select}
          aria-invalid={!!errorMessage} 
          aria-describedby={errorMessage ? `${selectId}-error` : undefined}
          {...props}
        >
          {}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.selectArrow}></span> {}
      </div>
      {errorMessage && (
        <p id={`${selectId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};