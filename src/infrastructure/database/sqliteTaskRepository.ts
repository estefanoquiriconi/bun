import { Database } from 'bun:sqlite';
import type { TaskRepository } from '../../core/repositories/taskRepository';
import type { Task } from '../../core/domain/task';

export class SQLiteTaskRepository implements TaskRepository {
  private db: Database;

  constructor() {
    this.db = new Database('tasks.db');
    this.initDatabase();
  }

  private initDatabase() {
    this.db
      .query(
        `
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT FALSE,
            createdAt DATETIME
        );`
      )
      .run();
  }

  async create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    this.db
      .query(
        `
        INSERT INTO tasks (id, title, description, completed, createdAt)
        VALUES ($id, $title, $description, $completed, $createdAt)
        `
      )
      .run({
        $id: id,
        $title: task.title,
        $description: task.description,
        $completed: task.completed ? 1 : 0,
        $createdAt: createdAt.toISOString(),
      });

    return { ...task, id, createdAt };
  }

  async findAll(): Promise<Task[]> {
    const result = this.db.query('SELECT * FROM tasks').all() as Task[];
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: Boolean(row.completed),
      createdAt: new Date(row.createdAt),
    }));
  }

  async update(
    id: string,
    data: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): Promise<Task | null> {
    const currentTask = await this.findById(id);
    if (!currentTask) return null;

    const updatedTask = { ...currentTask, ...data };

    this.db
      .query(
        `UPDATE  tasks SET 
        title = $title, 
        description = $description,
        completed = $completed
      WHERE id = $id
       `
      )
      .run({
        $id: id,
        $title: updatedTask.title,
        $description: updatedTask.description,
        $completed: updatedTask.completed ? 1 : 0,
      });

    return updatedTask;
  }

  async findById(id: string): Promise<Task | null> {
    const task = this.db
      .query('SELECT * FROM tasks WHERE id = $id')
      .get({ $id: id }) as unknown as Task;
    if (!task) return null;
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: Boolean(task.completed),
      createdAt: new Date(task.createdAt),
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db
      .query('DELETE FROM tasks WHERE id = $id')
      .run({ $id: id });

    return result.changes > 0;
  }

  async clear() {
    this.db.query('DELETE FROM tasks').run();
  }
}
