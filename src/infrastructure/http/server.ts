import { CreateTaskUseCase } from '../../core/usecases/createTask';
import { SQLiteTaskRepository } from '../database/sqliteTaskRepository';
import { errorHandler } from './utils/errorHandler';

const taskRepository = new SQLiteTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/tasks' && req.method === 'POST') {
      try {
        const body = await req.json();
        const task = await createTaskUseCase.execute(body);
        return Response.json(task, { status: 201 });
      } catch (error) {
        return errorHandler(error);
      }
    }

    if (url.pathname === '/tasks' && req.method === 'GET') {
      const tasks = await taskRepository.findAll();
      return Response.json(tasks);
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Server running on http://localhost:3000`);
