import { beforeEach, describe, expect, it } from 'bun:test';
import { SQLiteTaskRepository } from '../src/infrastructure/database/sqliteTaskRepository';

describe('API HTTP', () => {
  const baseUrl = 'http://localhost:3000/tasks';
  const repository = new SQLiteTaskRepository();

  beforeEach(async () => {
    await repository.clear();
  });

  it('GET /tasks devuelve lista vacía inicialmente', async () => {
    const response = await fetch(baseUrl);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('POST /tasks crea una nueva tarea', async () => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Bun' }),
    });

    expect(response.status).toBe(201);
    const task = await response.json();
    expect(task.title).toBe('Test Bun');
    expect(task.id).toBeString();
  });

  it('POST /tasks falla con título inválido', async () => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'A' }),
    });

    expect(response.status).toBe(400);
    const error = await response.json();
    expect(error.details[0].message).toBe(
      'String must contain at least 3 character(s)'
    );
  });

  it('PUT /tasks/:id actualiza una tarea existente', async () => {
    const postResponse = await fetch(baseUrl, {
      method: 'POST',
      body: JSON.stringify({ title: 'Estudiar Bun' }),
    });
    const task = await postResponse.json();
    
    const putResponse = await fetch(`${baseUrl}/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed: true }),
    });

    expect(putResponse.status).toBe(200);
    const updatedTask = await putResponse.json();
    expect(updatedTask.completed).toBe(true);
  });

  it('PUT /tasks/:id falla con ID inexistente', async () => {
    const response = await fetch(`${baseUrl}/fake-id`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'No existo' }),
    });

    expect(response.status).toBe(404);
  });
});
