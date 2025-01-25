import { z } from 'zod';
import type { TaskRepository } from '../repositories/taskRepository';
import type { Task } from '../domain/task';

const UpdateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    id: string,
    data: z.infer<typeof UpdateTaskSchema>
  ): Promise<Task | null> {
    const validatedData = UpdateTaskSchema.parse(data);
    return this.taskRepository.update(id, validatedData);
  }
}
