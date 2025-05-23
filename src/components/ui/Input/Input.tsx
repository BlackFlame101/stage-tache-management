import React, { useId } from 'react';
import styles from './Input.module.css'; 


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;  
}

export const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  id, 
  className, 
  type = 'text', 
  ...props 
}) => {
  const generatedId = useId(); 
  const inputId = id || generatedId;

  const wrapperClasses = `
    ${styles.inputWrapper}
    ${errorMessage ? styles.hasError : ''}
    ${className || ''}
  `;

  return (
    <div className={wrapperClasses.trim()}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={styles.input}
        aria-invalid={!!errorMessage} 
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        {...props}
      />
      {errorMessage && (
        <p id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};