import React from 'react';
import styles from './Card.module.css'; 

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className, 
  ...props 
}) => {
  const cardClasses = `
    ${styles.card}
    ${className || ''}
  `;

  return (
    <div className={cardClasses.trim()} {...props}>
      {children}
    </div>
  );
};