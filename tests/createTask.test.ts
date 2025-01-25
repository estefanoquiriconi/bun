import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import type { Task } from '../src/core/domain/task';
import type { TaskRepository } from '../src/core/repositories/taskRepository';
import { CreateTaskUseCase } from '../src/core/usecases/createTask';

class MockTaskRepository implements TaskRepository {
  async create(task: Omit<Task, 'id' | 'createdAt'>) {
    return {
      id: '1',
      ...task,
      createdAt: new Date(),
    };
  }

  async findAll() {
    return [];
  }
}

describe('CreateTaskUseCase', () => {
  it('debe crear una tarea válida', async () => {
    const repository = new MockTaskRepository();
    const useCase = new CreateTaskUseCase(repository);

    const task = await useCase.execute({
      title: 'Hacer tests',
      description: 'Escribir tests unitarios',
    });

    expect(task.title).toBe('Hacer tests');
    expect(task.id).toBeString();
  });

  it('debe fallar si el título es muy corto', async () => {
    const repository = new MockTaskRepository();
    const useCase = new CreateTaskUseCase(repository);

    expect(useCase.execute({ title: 'A' })).rejects.toThrow(z.ZodError);
  });
});
