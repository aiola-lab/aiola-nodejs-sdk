export class AiolaStreamingError extends Error {
  constructor(message: string, public details?: Record<string, any>) {
    super(message);
    this.name = 'AiolaStreamingError';
  }
}

export class ConnectionError extends AiolaStreamingError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
    this.name = 'ConnectionError';
  }
}

export class AuthenticationError extends AiolaStreamingError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
    this.name = 'AuthenticationError';
  }
} 