import React, { useId } from 'react';
import styles from './Textarea.module.css'; 


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
  
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  errorMessage,
  id, 
  className, 
  rows = 3, 
  ...props 
}) => {
  const generatedId = useId(); 
  const textareaId = id || generatedId;

  const wrapperClasses = `
    ${styles.textareaWrapper}
    ${errorMessage ? styles.hasError : ''}
    ${className || ''}
  `;

  return (
    <div className={wrapperClasses.trim()}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={styles.textarea}
        rows={rows}
        aria-invalid={!!errorMessage} 
        aria-describedby={errorMessage ? `${textareaId}-error` : undefined}
        {...props}
      />
      {errorMessage && (
        <p id={`${textareaId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};