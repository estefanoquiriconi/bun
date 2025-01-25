import type { TaskRepository } from '../repositories/taskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.taskRepository.delete(id);
  }
}
