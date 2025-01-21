import { z } from 'zod';

export const streamingStatsSchema = z.object({
  totalAudioSentDuration: z.number().default(0),
  connectionStartTime: z.number().nullable().default(null)
});

export type StreamingStats = z.infer<typeof streamingStatsSchema>; 