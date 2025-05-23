import React from 'react';
import { Task, TaskStatus } from '@/models/task.model';
import { TaskCard } from '@/components/tasks/TaskCard/TaskCard';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isLoading?: boolean; 
  error?: string | null; 
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  isLoading,
  error,
}) => {
  if (isLoading) {
    
    return <div className={styles.loadingMessage}>Chargement des tâches...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>Erreur: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className={styles.emptyMessage}>Aucune tâche à afficher pour le moment. Créez-en une nouvelle !</div>;
  }

  return (
    <div className={styles.taskListGrid}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};