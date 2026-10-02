import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const perspectivas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/perspectivas' }),
  schema: z.object({
    numero: z.string(),
    titulo: z.string(),
    tipo: z.enum(['ensayo', 'nota-de-campo', 'lectura-extensa']),
    fecha: z.string(),
    palabras: z.number().optional(),
    resumen: z.string(),
    imagen: z.string().optional(),
    estado: z.enum(['proximamente', 'terminado']),
  }),
});

export const collections = { perspectivas };
