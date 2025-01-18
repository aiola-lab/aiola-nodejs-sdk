import { z } from 'zod';

export const authHeadersSchema = z.object({
  headers: z.record(z.string())
});

export const authCredentialsSchema = z.object({
  authType: z.string(),
  credentials: z.record(z.any())
});

export type AuthHeaders = z.infer<typeof authHeadersSchema>;
export type AuthCredentials = z.infer<typeof authCredentialsSchema>; 