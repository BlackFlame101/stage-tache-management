import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css'; 
import { X } from 'lucide-react'; 


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode; 
  size?: 'small' | 'medium' | 'large'; 
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  size = 'medium',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  if (!isOpen) {
    return null; 
  }

  
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) { 
      onClose();
    }
  };

  const modalPanelClasses = `
    ${styles.modalPanel}
    ${styles[size]}
  `;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      tabIndex={-1} 
      ref={modalRef} 
    >
      <div className={modalPanelClasses}>
        <div className={styles.modalHeader}>
          {title && <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer la modale" 
          >
            <X size={22} /> {}
          </button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
        {footerContent && (
          <div className={styles.modalFooter}>
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};