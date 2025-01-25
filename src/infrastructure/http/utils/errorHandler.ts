import { z } from 'zod';

export function errorHandler(error: unknown): Response {
  if (error instanceof z.ZodError) {
    return Response.json(
      { error: 'Datos inválidos', details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    { error: 'Error desconocido' },
    {
      status: 500,
    }
  );
}
