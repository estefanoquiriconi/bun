import { describe, expect, it, mock } from 'bun:test';
import { DeleteTaskUseCase } from '../src/core/usecases/deleteTask';
import type { TaskRepository } from '../src/core/repositories/taskRepository';

describe('DeleteTaskUseCase', () => {
  it('elimina una tarea existente', async () => {
    const mockRepository = {
      delete: mock(() => Promise.resolve(true)),
    } as unknown as TaskRepository;

    const useCase = new DeleteTaskUseCase(mockRepository);
    const result = await useCase.execute('1');

    expect(result).toBeTrue();
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  it('falla si la tarea no existe', async () => {
    const mockRepository = {
      delete: mock(() => Promise.resolve(false)),
    } as unknown as TaskRepository;

    const useCase = new DeleteTaskUseCase(mockRepository);
    const result = await useCase.execute('99');

    expect(result).toBeFalse();
  });
});
