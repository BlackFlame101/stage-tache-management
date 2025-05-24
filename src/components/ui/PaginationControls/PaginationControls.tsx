import React from 'react';
import { Button } from '@/components/ui/Button/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './PaginationControls.module.css';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; 
  isLoading?: boolean; 
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  if (totalPages <= 1) {
    return null; 
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const pageNumbers = [];
  const maxPagesToShow = 5; 
  
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push(-1); 
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push(-1); 
        }
        pageNumbers.push(totalPages);
    }
  }


  return (
    <nav className={styles.paginationContainer} aria-label="Pagination">
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        variant="ghost"
        size="small"
        leftIcon={<ChevronLeft size={18} />}
        className={styles.navButton}
        aria-label="Page précédente"
      >
        Précédent
      </Button>

      <div className={styles.pageNumbersContainer}>
        {pageNumbers.map((page, index) =>
          page === -1 ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="small"
              className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}
      </div>
      
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        variant="ghost"
        size="small"
        rightIcon={<ChevronRight size={18} />}
        className={styles.navButton}
        aria-label="Page suivante"
      >
        Suivant
      </Button>
    </nav>
  );
};