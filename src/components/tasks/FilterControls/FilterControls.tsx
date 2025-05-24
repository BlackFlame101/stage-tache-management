import React from 'react';
import { TaskStatus } from '@/models/task.model';
import { Select, SelectOption } from '@/components/ui/Select/Select';
import styles from './FilterControls.module.css';

interface FilterControlsProps {
  currentFilter: TaskStatus | 'all';
  onFilterChange: (filter: TaskStatus | 'all') => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const filterOptions: SelectOption[] = [
    { value: 'all', label: 'Toutes les tâches' },
    { value: TaskStatus.ToDo, label: TaskStatus.ToDo },
    { value: TaskStatus.InProgress, label: TaskStatus.InProgress },
    { value: TaskStatus.Completed, label: TaskStatus.Completed },
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value as TaskStatus | 'all');
  };

  return (
    <div className={styles.filterControlsContainer}>
      <Select
        label="Filtrer par statut:"
        options={filterOptions}
        value={currentFilter}
        onChange={handleSelectChange}
        id="status-filter"
        className={styles.filterSelect}
      />
    </div>
  );
};