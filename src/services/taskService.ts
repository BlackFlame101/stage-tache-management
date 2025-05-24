import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from '@/models/task.model';

const TASKS_STORAGE_KEY = 'appTaskManager.tasks';
const SIMULATED_API_DELAY = 300;

const getTasksFromStorage = (): Task[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
  try {
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error);
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export interface PaginatedTasksResponse {
  tasks: Task[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const fetchTasks = async (page: number, limit: number): Promise<PaginatedTasksResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let allTasks = getTasksFromStorage();
      allTasks.sort((a, b) => {
        try { 
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        } catch (e) {
          return 0; 
        }
      });

      const totalCount = allTasks.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = allTasks.slice(startIndex, endIndex);

      resolve({
        tasks: paginatedTasks,
        totalCount,
        currentPage: page,
        totalPages,
      });
    }, SIMULATED_API_DELAY);
  });
};

export const getTaskById = async (id: string): Promise<Task | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = getTasksFromStorage();
      const task = tasks.find(t => t.id === id);
      resolve(task);
    }, SIMULATED_API_DELAY);
  });
};

export const createTask = async (
  taskData: Pick<Task, 'title' | 'description' | 'dueDate'>
): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentTasks = getTasksFromStorage();
      const newTask: Task = {
        id: uuidv4(),
        title: taskData.title,
        description: taskData.description || undefined,
        dueDate: taskData.dueDate,
        status: TaskStatus.ToDo,
        createdAt: new Date().toISOString(),
      };
      const updatedTasks = [...currentTasks, newTask];
      saveTasksToStorage(updatedTasks);
      resolve(newTask);
    }, SIMULATED_API_DELAY);
  });
};

export const updateTask = async (
  id: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<Task | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentTasks = getTasksFromStorage();
      const taskIndex = currentTasks.findIndex(t => t.id === id);

      if (taskIndex === -1) {
        resolve(undefined);
        return;
      }
      const updatedTask: Task = {
        ...currentTasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const updatedTasks = [...currentTasks];
      updatedTasks[taskIndex] = updatedTask;
      saveTasksToStorage(updatedTasks);
      resolve(updatedTask);
    }, SIMULATED_API_DELAY);
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentTasks = getTasksFromStorage();
      const updatedTasks = currentTasks.filter(t => t.id !== id);
      saveTasksToStorage(updatedTasks);
      resolve();
    }, SIMULATED_API_DELAY);
  });
};
