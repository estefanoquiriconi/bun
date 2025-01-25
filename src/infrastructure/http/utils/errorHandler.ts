import { z } from 'zod';

export function errorHandler(error: unknown): Response {
  if (error instanceof z.ZodError) {
    return new Response(
      JSON.stringify({ error: 'Datos inválidos', details: error.errors }),
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ error: 'Error desconocido' }), {
    status: 500,
  });
}
