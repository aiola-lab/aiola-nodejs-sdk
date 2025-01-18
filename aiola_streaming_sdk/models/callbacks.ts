import { z } from 'zod';

export const callbacksSchema = z.object({
  onConnect: z.function().optional(),
  onDisconnect: z.function().args(z.number(), z.number()).optional(),
  onTranscript: z.function().args(z.any()).optional(),
  onEvents: z.function().args(z.any()).optional(),
  onError: z.function().args(z.any()).optional()
});

export type Callbacks = z.infer<typeof callbacksSchema>; 