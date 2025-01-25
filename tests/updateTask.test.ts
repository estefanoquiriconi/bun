import { describe, expect, it, mock } from 'bun:test';
import { UpdateTaskUseCase } from '../src/core/usecases/updateTask';
import type { TaskRepository } from '../src/core/repositories/taskRepository';

const mockRepository = {
  update: mock(async (id: string, data: any) => ({
    id,
    title: data.title || 'Tarea existente',
    completed: data.completed || false,
    createdAt: new Date(),
  })),
} as unknown as TaskRepository;

describe('UpdateTaskUseCase', () => {
  it('actualiza el título de una tarea', async () => {
    const useCase = new UpdateTaskUseCase(mockRepository);
    const updatedTask = await useCase.execute('1', { title: 'Nuevo título' });

    expect(updatedTask?.title).toBe('Nuevo título');
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it('devuelve null si la tarea no existe', async () => {
    const mockRepoError = {
      update: async () => null,
      create: async () => {
        throw new Error('Not implemented');
      },
      findAll: async () => {
        throw new Error('Not implemented');
      },
      delete: async () => {
        throw new Error('Not implemented');
      },
    } as TaskRepository;

    const useCase = new UpdateTaskUseCase(mockRepoError);
    const result = await useCase.execute('99', { title: 'No existo' });

    expect(result).toBeNull();
  });
});
