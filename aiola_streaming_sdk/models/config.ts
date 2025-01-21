import { z } from 'zod';
import {callbacksSchema } from './callbacks';

export const streamingConfigSchema = z.object({
  endpoint: z.string().url(),
  authType: z.enum(['Cookie', 'Bearer', 'x-api-key']),
  authCredentials: z.record(z.any()),
  
  // Stream parameters
  flowId: z.string().default('default_flow'),
  executionId: z.string().default('1'),
  langCode: z.string().default('en_US'),
  timeZone: z.string().default('UTC'),
  namespace: z.string().default('/events'),
  transports: z.string().default('polling'),
  
  // Nested configurations
  callbacks: callbacksSchema.default({})
});

export type StreamingConfig = z.infer<typeof streamingConfigSchema>; 