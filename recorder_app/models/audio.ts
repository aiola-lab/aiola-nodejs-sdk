import { z } from 'zod';

export const audioConfigSchema = z.object({
  sampleRate: z.number().default(16000),
  channels: z.number().default(1),
  chunkSize: z.number().default(4096),
  dtype: z.string().default('int16'),
  audioType: z.string().default('wav')
});

export type AudioConfig = z.infer<typeof audioConfigSchema>; 