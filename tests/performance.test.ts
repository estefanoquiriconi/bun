import { describe, expect, it } from 'bun:test';

describe('Rendimiento', () => {
  it(
    'crear 100 tareas',
    async () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          body: JSON.stringify({ title: `Tarea ${i}` }),
        });
      }

      const end = performance.now();
      console.log(
        `Tiempo para 100 solicitudes: ${(end - start).toFixed(2)}ms`
      );
      expect(end - start).toBeLessThan(1000);
    },
    { timeout: 1000 }
  );
});
