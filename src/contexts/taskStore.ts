import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { Task, TaskStatus } from '@/models/task.model';
import {
  fetchTasks as apiFetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  PaginatedTasksResponse
} from '@/services/taskService';

const TASKS_PER_PAGE = 5; 

interface TaskState {
  tasks: Task[]; 
  isLoading: boolean;
  error: string | null;
  currentFilter: TaskStatus | 'all';
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  tasksPerPage: number;
}

interface TaskActions {
  fetchTasks: (page?: number) => Promise<void>; 
  addTask: (taskData: Pick<Task, 'title' | 'description' | 'dueDate'>) => Promise<Task | undefined>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: TaskStatus | 'all') => void;
  goToPage: (page: number) => void; 
}

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  
  tasks: [],
  isLoading: false,
  error: null,
  currentFilter: 'all',
  currentPage: 1,
  totalPages: 0,
  totalTasks: 0,
  tasksPerPage: TASKS_PER_PAGE,

  
  fetchTasks: async (page?: number) => {
    const { currentPage, tasksPerPage, currentFilter } = get();
    const pageToFetch = page || currentPage;

    set({ isLoading: true, error: null });
    try {
      const response: PaginatedTasksResponse = await apiFetchTasks(pageToFetch, tasksPerPage);
      set({
        tasks: response.tasks,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalTasks: response.totalCount,
        isLoading: false,
      });
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
      toast.success("Tâche ajoutée avec succès !");
      await get().fetchTasks(1); 
                          
      await get().fetchTasks(get().currentPage);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      set({ error: `Échec de l'ajout de la tâche : ${errorMessage}`, isLoading: false });
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
            task.id === id ? { ...task, ...updatedTask } : task
          ),
          isLoading: false,
        }));
        toast.success("Tâche mise à jour avec succès !");
        
        if (updates.dueDate) {
            await get().fetchTasks(get().currentPage);
        }
      } else {
        const notFoundMessage = `Échec de la mise à jour : Tâche avec l'ID ${id} introuvable.`;
        set({ error: notFoundMessage, isLoading: false });
        toast.error(notFoundMessage);
      }
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      set({ error: `Échec de la mise à jour de la tâche : ${errorMessage}`, isLoading: false });
      toast.error("Échec de la mise à jour de la tâche.");
      console.error("Error updating task:", err);
      return undefined;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteTask(id);
      toast.success("Tâche supprimée avec succès !");
      const { currentPage, tasks, totalTasks, tasksPerPage } = get();
      
      if (tasks.length === 1 && currentPage > 1 && (totalTasks -1) > 0 ) {
         await get().fetchTasks(currentPage - 1);
      } else {
         await get().fetchTasks(currentPage); 
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      set({ error: `Échec de la suppression de la tâche : ${errorMessage}`, isLoading: false });
      toast.error("Échec de la suppression de la tâche.");
      console.error("Error deleting task:", err);
    }
  },

  setFilter: (filter) => {
    set({ currentFilter: filter, currentPage: 1 });
    get().fetchTasks(1);
  },

  goToPage: (page: number) => {
    const { totalPages, fetchTasks } = get(); 
    if (page >= 1 && page <= totalPages) {
      set({ currentPage: page });
      fetchTasks(page); 
    } else if (page < 1 && totalPages > 0) { 
        set({ currentPage: 1 });
        fetchTasks(1);
    } else if (page > totalPages && totalPages > 0) { 
        set({ currentPage: totalPages});
        fetchTasks(totalPages);
    }
    else if (totalPages === 0) {
        set({ currentPage: 1});
        fetchTasks(1);
    }
  },
}));

export const selectFilteredTasks = (state: TaskState) => {
  if (state.currentFilter === 'all') {
    return state.tasks;
  }
  return state.tasks.filter(task => task.status === state.currentFilter);
};
