import { AuthHeaders } from '../models/auth';
import { AuthenticationError } from '../exceptions';

export function getAuthHeaders(
  authType: string,
  authCredentials: Record<string, any>
): AuthHeaders {
  switch (authType) {
    case 'Cookie':
      if (!authCredentials.cookie) {
        throw new AuthenticationError('Cookie value is required for Cookie authentication');
      }
      return { headers: { Cookie: authCredentials.cookie } };

    case 'Bearer':
      if (!authCredentials.token) {
        throw new AuthenticationError('Token is required for Bearer authentication');
      }
      return { headers: { AUTHORIZATION: `Bearer ${authCredentials.token}` } };

    case 'x-api-key':
      if (!authCredentials.api_key) {
        throw new AuthenticationError('API key is required for x-api-key authentication');
      }
      return {
        headers: {
          'x-api-key': authCredentials.api_key,
          'Content-Type': 'application/json'
        }
      };

    default:
      throw new AuthenticationError(`Unsupported authentication type: ${authType}`);
  }
} 