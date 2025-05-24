'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '@/contexts/taskStore';
import { Task } from '@/models/task.model';
import { TaskList } from '@/components/tasks/TaskList/TaskList';
import { TaskForm, TaskFormData } from '@/components/tasks/TaskForm/TaskForm';
import { FilterControls } from '@/components/tasks/FilterControls/FilterControls';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { PaginationControls } from '@/components/ui/PaginationControls/PaginationControls'; 
import { PlusCircle } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setFilter = useTaskStore((state) => state.setFilter);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const allTasksFromStore = useTaskStore((state) => state.tasks); 
  const currentFilter = useTaskStore((state) => state.currentFilter);
  const currentPage = useTaskStore((state) => state.currentPage);
  const totalPages = useTaskStore((state) => state.totalPages);
  const goToPage = useTaskStore((state) => state.goToPage);
  const totalTasksInStore = useTaskStore((state) => state.totalTasks); 
  
  const tasksToDisplay = useMemo(() => {
    
    if (currentFilter === 'all') {
      return allTasksFromStore;
    }
    return allTasksFromStore.filter(task => task.status === currentFilter);
  }, [allTasksFromStore, currentFilter]);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openAddTaskModal = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const openDeleteConfirmModal = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const closeDeleteConfirmModal = () => {
    setTaskToDelete(null);
  };
  
  const handleAddTaskSubmit = async (data: TaskFormData) => {
    const taskDataForApi = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
    };
    await addTask(taskDataForApi); 
    closeModal();
  };

  const handleEditTaskSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data); 
      closeModal();
    }
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete); 
      closeDeleteConfirmModal();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await updateTask(taskId, { status: newStatus }); 
  };

  const handlePageChange = (page: number) => {
    goToPage(page); 
  };

  return (
    <div className={styles.homePageWrapper}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Liste des Tâches</h1>
        <Button
          variant="primary"
          onClick={openAddTaskModal}
          leftIcon={<PlusCircle size={20} />}
          className={styles.addTaskButton}
        >
          Ajouter une tâche
        </Button>
      </header>
      <FilterControls
        currentFilter={currentFilter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter); 
        }}
      />
      <TaskList
        tasks={tasksToDisplay}
        onEditTask={openEditTaskModal}
        onDeleteTask={openDeleteConfirmModal}
        onStatusChange={handleStatusChange}
        
        isLoading={isLoading && (totalTasksInStore === 0 && currentFilter === 'all' && currentPage === 1)}
        error={error}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeModal}
        title={editingTask ? "Modifier la tâche" : "Ajouter une nouvelle tâche"}
        size="medium"
      >
        <TaskForm
          onSubmit={editingTask ? handleEditTaskSubmit : handleAddTaskSubmit}
          onCancel={closeModal}
          initialData={editingTask}
          isEditing={!!editingTask}
          isLoading={isLoading}
        />
      </Modal>
      {taskToDelete && (
        <Modal
            isOpen={!!taskToDelete}
            onClose={closeDeleteConfirmModal}
            title="Confirmer la suppression"
            size="small"
            footerContent={
                <>
                    <Button variant="secondary" onClick={closeDeleteConfirmModal} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteTask} isLoading={isLoading}>
                        Supprimer
                    </Button>
                </>
            }
        >
            <p>Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</p>
        </Modal>
      )}
    </div>
  );
}