import fetch, { Blob as FetchBlob, Response } from 'node-fetch';
import { Readable } from 'stream';


/**
 * Types for request and response handling
 */
type SynthesizeRequest = {
  text: string;
  voice?: string;
};

type SynthesizeResponse = Blob;

type StreamResponse = Blob;

type ErrorResponse = {
  detail: string;
};

/**
 * AiOlaTTSClient
 * A client for interacting with the aiOla Text-to-Speech API.
 */
export class AiOlaTTSClient {
  private readonly baseUrl: string;
  private readonly bearerToken: string;

  /**
   * @param baseUrl - The base URL for the aiOla TTS API.
   * @param bearerToken - The Bearer token for authentication.
   */
  constructor(baseUrl: string, bearerToken: string) {
    if (!baseUrl) {
      throw new Error('baseUrl is required');
    }
    if (!bearerToken) {
      throw new Error('bearerToken is required');
    }
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
  }

  /**
   * Helper method for making HTTP POST requests.
   * @param endpoint - The API endpoint to call.
   * @param data - The payload for the POST request.
   * @returns A Promise resolving to a Blob for audio data or throwing an error.
   */
  private async postRequest(endpoint: string, data: SynthesizeRequest): Promise<FetchBlob | ErrorResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.bearerToken}`, // Added Authorization header
      },
      body: new URLSearchParams(data as Record<string, string>),
    });
    

    if (response.ok) {
      if (response.headers.get('Content-Type')?.includes('audio/wav')) {
        return await response.blob(); // Will now be typed as FetchBlob
      }
      return (await response.json()) as ErrorResponse;
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  /**
 * Sends a POST request to the specified API endpoint with the provided data
 * and returns the response as a readable stream.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {SynthesizeRequest} data - The payload for the POST request.
 * @returns {Promise<Readable>} A promise that resolves to a readable stream of the response body.
 * @throws {Error} Throws an error if the response is not successful.
 */
async postRequestStream(
    endpoint: string,
    data: SynthesizeRequest
  ): Promise<Readable> {
    const response: Response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.bearerToken}`,
      },
      body: new URLSearchParams(data as Record<string, string>),
    });

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json();
      throw new Error(errorResponse.detail || 'Request failed');
    }

    return Readable.from(response.body as any);
  }

  /**
   * Synthesize Speech
   * Converts text to speech and retrieves the audio file.
   * @param request - The synthesis request payload.
   * @returns A Promise resolving to the synthesized audio file as a Blob.
   */
  public async synthesize(request: SynthesizeRequest): Promise<SynthesizeResponse> {
    if (!request.text || request.text.trim().length === 0) {
      throw new Error('Text is required for synthesis');
    }

    const payload: SynthesizeRequest = {
      text: request.text,
      voice: request.voice || 'af_bella',
    };

    return (await this.postRequest('/synthesize', payload)) as SynthesizeResponse;
  }

  /**
 * Asynchronously sends a synthesis request and processes the streamed response.
 *
 * @param {SynthesizeRequest} payload - The payload containing synthesis parameters.
 * @param {(chunk: any) => void} on_chunk_data - Callback invoked for each data chunk received.
 * @param {() => void} on_chunk_end - Callback invoked when the data stream ends.
 * @param {(err: Error) => void} on_error - Callback invoked upon encountering an error.
 * @returns {Promise<void>} A promise that resolves when processing is complete.
 */
  async synthesizeAndProcess(
    payload: SynthesizeRequest,
    on_chuck_data:(chunk: any) => void,
    on_chuck_end:() => void,
    on_error:(err: Error) => void
  ): Promise<void> {
    try {
      const nodeStream = await this.postRequestStream('/synthesize/stream', payload);

      nodeStream.on('data',on_chuck_data);
      nodeStream.on('end', on_chuck_end);
      nodeStream.on('error',on_error);
    } catch (error) {
      console.error('Error during synthesis:', (error as Error).message);
    }
  }

  /**
   * Stream Speech
   * Converts text to speech and streams the audio data.
   * @param request - The streaming request payload.
   * @returns A Promise resolving to the streamed audio file as a Blob.
   */
  public async synthesizeStream(request: SynthesizeRequest): Promise<StreamResponse> {
    if (!request.text || request.text.trim().length === 0) {
      throw new Error('Text is required for streaming');
    }

    const payload: SynthesizeRequest = {
      text: request.text,
      voice: request.voice || 'af_bella',
    };

    return (await this.postRequest('/synthesize/stream', payload)) as StreamResponse;
  }

  /**
 * Initiates a text-to-speech synthesis request and processes the streamed audio response.
 *
 * @param {SynthesizeRequest} request - The payload containing synthesis parameters.
 * @param {(chunk: any) => void} on_chunk_data - Callback invoked for each data chunk received.
 * @param {() => void} on_chunk_end - Callback invoked when the data stream ends.
 * @param {(err: Error) => void} on_error - Callback invoked upon encountering an error.
 * @returns {Promise<void>} A promise that resolves when the streaming and processing are complete.
 */
public async synthesizeStreamChunks(request: SynthesizeRequest,
    on_chuck_data:(chunk: any) => void,
    on_chuck_end:() => void,
    on_error:(err: Error) => void
  ): Promise<void> {
    if (!request.text || request.text.trim().length === 0) {
      throw new Error('Text is required for streaming');
    }

    const payload: SynthesizeRequest = {
      text: request.text,
      voice: request.voice || 'af_bella',
    };
    await this.synthesizeAndProcess(payload, on_chuck_data, on_chuck_end, on_error);
  }
}