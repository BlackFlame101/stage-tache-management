import React from 'react';
import styles from './Button.module.css'; 


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; 
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean; 
  
  
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary', 
  size = 'medium',     
  leftIcon,
  rightIcon,
  isLoading = false,
  className, 
  disabled,
  ...props 
}) => {
  
  const buttonClasses = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${isLoading ? styles.loading : ''}
    ${className || ''}
  `;

  return (
    <button
      className={buttonClasses.trim()}
      disabled={disabled || isLoading} 
      {...props}
    >
      {isLoading && <span className={styles.spinner}></span>}
      {!isLoading && leftIcon && <span className={styles.iconWrapper}>{leftIcon}</span>}
      {!isLoading && children}
      {!isLoading && rightIcon && <span className={styles.iconWrapper}>{rightIcon}</span>}
    </button>
  );
};