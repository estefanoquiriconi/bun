import { CreateTaskUseCase } from '../../core/usecases/createTask';
import { DeleteTaskUseCase } from '../../core/usecases/deleteTask';
import { UpdateTaskUseCase } from '../../core/usecases/updateTask';
import { SQLiteTaskRepository } from '../database/sqliteTaskRepository';
import { errorHandler } from './utils/errorHandler';

const taskRepository = new SQLiteTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updatedTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

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

    if (url.pathname.startsWith('/tasks/') && req.method === 'PUT') {
      const id = url.pathname.split('/')[2];
      try {
        const body = await req.json();
        const updatedTask = await updatedTaskUseCase.execute(id, body);

        if (!updatedTask)
          return Response.json({ error: 'Task not found' }, { status: 404 });

        return Response.json(updatedTask);
      } catch (error) {
        return errorHandler(error);
      }
    }

    if (url.pathname.startsWith('/tasks/') && req.method === 'DELETE') {
      const id = url.pathname.split('/')[2];
      try {
        const deleted = await deleteTaskUseCase.execute(id);

        return deleted
          ? new Response(null, { status: 204 })
          : new Response(JSON.stringify({ error: 'Task not found' }), {
              status: 404,
            });
      } catch (error) {
        return errorHandler(error);
      }
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Server running on http://localhost:3000`);
