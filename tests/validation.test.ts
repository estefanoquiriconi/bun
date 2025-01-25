import { CreateTaskSchema } from '../src/core/usecases/createTask';
import { describe, expect, it } from 'bun:test';

describe('Esquema de validación (Zod)', () => {
  it('debe aceptar títulos válidos', () => {
    const input = { title: 'Comprar leche' };
    expect(() => CreateTaskSchema.parse(input)).not.toThrow();
  });

  it('debe rechazar títulos vacíos', () => {
    const input = { title: '' };
    expect(() => CreateTaskSchema.parse(input)).toThrow('3 character(s)');
  });

  it('debe permitir descripciones opcionales', () => {
    const input = { title: 'Ejercicio', description: '30 minutos de cardio' };
    expect(() => CreateTaskSchema.parse(input)).not.toThrow();
  });
});
