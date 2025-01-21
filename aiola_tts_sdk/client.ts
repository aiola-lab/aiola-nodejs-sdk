import fetch, { Blob as FetchBlob } from 'node-fetch';

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

  /**
   * @param baseUrl - The base URL for the aiOla TTS API.
   */
  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error('baseUrl is required');
    }
    this.baseUrl = baseUrl;
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
      },
      body: new URLSearchParams(data as Record<string, string>),
    });
  
    if (response.ok) {
      if (response.headers.get('Content-Type')?.includes('audio/wav')) {
        return await response.blob(); // Will now be typed as FetchBlob
      }
      return (await response.json()) as ErrorResponse;
    }
  
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.detail || `Request failed with status ${response.status}`);
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
}