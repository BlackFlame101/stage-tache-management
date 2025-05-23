export enum TaskStatus {
  ToDo = 'À faire',
  InProgress = 'En cours',
  Completed = 'Terminée',
}

export interface Task {
  id: string; 
  title: string; 
  description?: string; 
  dueDate: string; 
  status: TaskStatus; 
  createdAt: string; 
  updatedAt?: string; 
}