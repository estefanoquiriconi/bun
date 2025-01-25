import type { Task } from '../domain/task';

export interface TaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;
  findAll(): Promise<Task[]>;
}
