import { z } from 'zod';
import type { TaskRepository } from '../repositories/taskRepository';
import type { Task } from '../domain/task';

export const CreateTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

export class CreateTaskUseCase {
  constructor(private taskRespository: TaskRepository) {}

  async execute(input: z.infer<typeof CreateTaskSchema>): Promise<Task> {
    const validatedData = CreateTaskSchema.parse(input);

    const task: Omit<Task, 'id' | 'createdAt'> = {
      title: validatedData.title,
      description: validatedData.description ?? '',
      completed: false,
    };

    return this.taskRespository.create(task);
  }
}
