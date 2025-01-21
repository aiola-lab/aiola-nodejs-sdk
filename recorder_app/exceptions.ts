export class AiolaStreamingError extends Error {
  constructor(message: string, public details?: Record<string, any>) {
    super(message);
    this.name = 'AiolaStreamingError';
  }
}