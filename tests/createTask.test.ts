import { describe, expect, it, mock } from 'bun:test';
import { z } from 'zod';
import { CreateTaskUseCase } from '../src/core/usecases/createTask';
import type { TaskRepository } from '../src/core/repositories/taskRepository';

const createMockRepository = (): TaskRepository => ({
  create: mock(async task => ({
    id: '1',
    ...task,
    createdAt: new Date(),
  })),
  findAll: mock(async () => []),
  update: undefined as never,
  delete: undefined as never,
});

describe('CreateTaskUseCase', () => {
  const repository = createMockRepository();
  const createTaskUseCase = new CreateTaskUseCase(repository);

  it('debe crear una tarea válida', async () => {
    const task = await createTaskUseCase.execute({
      title: 'Hacer tests',
      description: 'Escribir tests unitarios',
    });

    expect(task.title).toBe('Hacer tests');
    expect(repository.create).toHaveBeenCalled();
  });

  it('debe fallar si el título es muy corto', async () => {
    expect(createTaskUseCase.execute({ title: 'A' })).rejects.toThrow(
      z.ZodError
    );
  });
});
