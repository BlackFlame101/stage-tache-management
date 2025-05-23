import { create } from 'zustand';
import { toast } from 'react-hot-toast'; 
import { Task, TaskStatus } from '@/models/task.model';
import {
  fetchTasks as apiFetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  
} from '@/services/taskService';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  currentFilter: TaskStatus | 'all';
}

interface TaskActions {
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Pick<Task, 'title' | 'description' | 'dueDate'>) => Promise<Task | undefined>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: TaskStatus | 'all') => void;
}

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  currentFilter: 'all',

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await apiFetchTasks();
      set({ tasks, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      const fullErrorMessage = `Échec de la récupération des tâches : ${errorMessage}`;
      set({ error: fullErrorMessage, isLoading: false });
      toast.error("Échec de la récupération des tâches."); 
      console.error("Error fetching tasks:", err);
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await apiCreateTask(taskData);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
      toast.success("Tâche ajoutée avec succès !"); 
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      const fullErrorMessage = `Échec de l'ajout de la tâche : ${errorMessage}`;
      set({ error: fullErrorMessage, isLoading: false });
      toast.error("Échec de l'ajout de la tâche."); 
      console.error("Error adding task:", err);
      return undefined;
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await apiUpdateTask(id, updates);
      if (updatedTask) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updatedTask : task
          ),
          isLoading: false,
        }));
        toast.success("Tâche mise à jour avec succès !"); 
      } else {
        const notFoundMessage = `Échec de la mise à jour : Tâche avec l'ID ${id} introuvable.`;
        set({ error: notFoundMessage, isLoading: false });
        toast.error(notFoundMessage); 
      }
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      const fullErrorMessage = `Échec de la mise à jour de la tâche : ${errorMessage}`;
      set({ error: fullErrorMessage, isLoading: false });
      toast.error("Échec de la mise à jour de la tâche."); 
      console.error("Error updating task:", err);
      return undefined;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
      toast.success("Tâche supprimée avec succès !"); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      const fullErrorMessage = `Échec de la suppression de la tâche : ${errorMessage}`;
      set({ error: fullErrorMessage, isLoading: false });
      toast.error("Échec de la suppression de la tâche."); 
      console.error("Error deleting task:", err);
    }
  },

  setFilter: (filter) => {
    set({ currentFilter: filter });
  },
}));

export const selectFilteredTasks = (state: TaskState) => {
  if (state.currentFilter === 'all') {
    return state.tasks;
  }
  return state.tasks.filter(task => task.status === state.currentFilter);
};