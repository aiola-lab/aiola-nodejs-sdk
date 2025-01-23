import fetch, { Blob } from 'node-fetch';
import { AudioFormat, convertAudioFormat } from './audio-converter';

/**
 * Types for request and response handling
 */
type SynthesizeRequest = {
  text: string;
  voice: 'af_bella' | 'af_nicole' | 'af_sarah' | 'af_sky' | 'am_adam' | 'am_michael' | 'bf_emma' | 'bf_isabella' | 'bm_george' | 'bm_lewis';
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
  private readonly audioFormat: AudioFormat;

  /**
   * @param baseUrl - The base URL for the aiOla TTS API.
   * @param bearerToken - The Bearer token for authentication.
   * @param audioFormat - The desired audio format (LINEAR16, MULAW, or PCM)
   */
  constructor(baseUrl: string, bearerToken: string, audioFormat: AudioFormat = 'LINEAR16') {
    if (!baseUrl) {
      throw new Error('baseUrl is required');
    }
    if (!bearerToken) {
      throw new Error('bearerToken is required');
    }
    if (!['LINEAR16', 'PCM'].includes(audioFormat)) {
      throw new Error('audioFormat must be one of: LINEAR16, PCM');
    }
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
    this.audioFormat = audioFormat;
  }

  /**
   * Helper method for making HTTP POST requests.
   * @param endpoint - The API endpoint to call.
   * @param data - The payload for the POST request.
   * @returns A Promise resolving to a Blob for audio data or throwing an error.
   */
  private async postRequest(endpoint: string, data: SynthesizeRequest): Promise<Blob | ErrorResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.bearerToken}`,
      },
      body: new URLSearchParams(data as Record<string, string>),
    });

    if (response.ok) {
      if (response.headers.get('Content-Type')?.includes('audio/wav')) {
        const audioBlob = await response.blob();
        return await convertAudioFormat(audioBlob as globalThis.Blob, this.audioFormat);
      }
      return (await response.json()) as ErrorResponse;
    }

    throw new Error(`Request failed with status ${response.status}`);
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