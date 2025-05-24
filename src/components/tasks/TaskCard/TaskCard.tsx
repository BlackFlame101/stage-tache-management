import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; 
import { Task, TaskStatus } from '@/models/task.model';
import { Card } from '@/components/ui/Card/Card'; 
import { Button } from '@/components/ui/Button/Button';
import { Select, SelectOption } from '@/components/ui/Select/Select';
import { Edit3, Trash2, CalendarDays, Info } from 'lucide-react';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}


const getStatusThemeClass = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.ToDo:
      return styles.themeTodo;
    case TaskStatus.InProgress:
      return styles.themeInProgress;
    case TaskStatus.Completed:
      return styles.themeCompleted;
    default:
      return '';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { id, title, description, dueDate, status } = task;

  let formattedDueDate = "Date non spécifiée";
  try {
    if (dueDate) {
      
      const date = new Date(dueDate + 'T00:00:00Z'); 
      formattedDueDate = format(date, 'PPP', { locale: fr });
    }
  } catch (error) {
    console.warn(`Invalid date format for task "${title}": ${dueDate}`);
  }


  const statusOptions: SelectOption[] = Object.values(TaskStatus).map(s => ({
    value: s,
    label: s,
  }));

  const handleLocalStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(id, event.target.value as TaskStatus);
  };

  return (
    <Card className={`${styles.taskCardInstance} ${getStatusThemeClass(status)}`}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.taskTitle}>{title}</h3>
          <span className={`${styles.statusBadge} ${getStatusThemeClass(status)}`}>
            {status}
          </span>
        </div>

        {description && (
          <p className={styles.taskDescription}>
            <Info size={15} className={styles.descriptionIcon} />
            {description}
          </p>
        )}

        <div className={styles.taskMeta}>
          <div className={styles.dueDateInfo}>
            <CalendarDays size={15} className={styles.metaIcon} />
            <span>Échéance : {formattedDueDate}</span>
          </div>
        </div>

        <div className={styles.statusChanger}>
          <Select
            label="Changer le statut :"
            options={statusOptions}
            value={status}
            onChange={handleLocalStatusChange}
            id={`status-select-${id}`}
            aria-label={`Changer le statut de la tâche ${title}`}
          />
        </div>
      </div>

      <div className={styles.cardActions}>
        <Button
          variant="ghost"
          size="small"
          onClick={() => onEdit(task)}
          aria-label={`Modifier la tâche ${title}`}
          leftIcon={<Edit3 size={16} />}
          className={styles.actionButton}
        >
          Modifier
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(id)}
          aria-label={`Supprimer la tâche ${title}`}
          leftIcon={<Trash2 size={16} />}
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          Supprimer
        </Button>
      </div>
    </Card>
  );
};