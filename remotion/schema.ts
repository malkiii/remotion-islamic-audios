import { z } from 'zod';

export const compositionSchema = z.object({
  name: z.string(),
  image: z.string(),
  audio: z.string(),
});

export type CompositionProps = z.infer<typeof compositionSchema>;
