import io from 'socket.io-client';
import { StreamingConfig } from './models/config';
import { StreamingStats } from './models/stats';
import { getAuthHeaders } from './services/auth';


export type AudioData = ArrayBufferLike;

export class AiolaStreamingClient {
  private config: StreamingConfig;
  private sio;
  private stats: StreamingStats;

  constructor(config: StreamingConfig) {
    this.config = config;
    
    // Build URL with query parameters
    const params = new URLSearchParams({
      flow_id: this.config.flowId,
      execution_id: this.config.executionId,
      lang_code: this.config.langCode,
      time_zone: this.config.timeZone
    });
    
    const _endpoint = `${this.config.endpoint}${this.config.namespace}?${params}`;
    console.log(_endpoint);
    console.log(getAuthHeaders(this.config.authType, this.config.authCredentials).headers);
    
    const _transports = this.config.transports == 'polling'?['polling']: this.config.transports == 'websocket'?['polling', 'websocket']:['polling', 'websocket'];

    this.sio = io(_endpoint, {
      transports: _transports,
      path: '/api/voice-streaming/socket.io',
      transportOptions: {
        polling: {
          extraHeaders: getAuthHeaders(this.config.authType, this.config.authCredentials).headers
        },
        websocket: {
          extraHeaders: getAuthHeaders(this.config.authType, this.config.authCredentials).headers
        }
      }
    });

    this.stats = {
      totalAudioSentDuration: 0,
      connectionStartTime: null,
    };

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.sio.on('connect', () => {
      this.stats.connectionStartTime = Date.now();
      this.config.callbacks?.onConnect?.();
    });

    this.sio.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      this.config.callbacks?.onError?.({ connection_error: error.message });
    });

    this.sio.on('error', (error: Error) => {
      console.error('Socket error:', error);
      this.config.callbacks?.onError?.({ socket_error: error.message });
    });

    this.sio.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
      if (this.config.callbacks?.onDisconnect) {
        const connectionDuration = Date.now() - (this.stats.connectionStartTime || 0);
        this.config.callbacks.onDisconnect(
          connectionDuration,
          this.stats.totalAudioSentDuration,
        );
      }
    });

    this.sio.on('transcript', (data: any, ack?: Function) => {
      this.config.callbacks?.onTranscript?.(data);
      if (ack) {
        ack({ status: 'received' });
      }
    });

    this.sio.on('events', (data: any, ack?: Function) => {
      this.config.callbacks?.onEvents?.(data);
      if (ack) {
        ack({ status: 'received' });
      }
    });
  }

  public set_kws(keywords: string[]): void {
    if (!this.sio.connected) {
      console.error('Socket is not connected. Unable to send keywords.');
      this.config.callbacks?.onError?.({ message: 'Socket not connected.' });
      return;
    }
  
    try {
      // Emit the "set_keywords" event with the keywords serialized to JSON
      const binaryData = JSON.stringify(keywords); // Serialize the list to JSON

      console.log('set_keywords: ',binaryData);
      
      this.sio.emit('set_keywords', binaryData, this.config.namespace);
    } catch (error: unknown) {
      // Narrow down 'error' to ensure it's an instance of Error
      if (error instanceof Error) {
        console.error('Error emitting keywords:', error.message);
        this.config.callbacks?.onError?.({ message: error.message });
      } else {
        console.error('Unknown error:', error);
        this.config.callbacks?.onError?.({ message: 'An unknown error occurred.' });
      }
    }
  }

  public writableStream = new WritableStream<AudioData>({
    write: (chunk: AudioData) => {
      if (this.sio.connected) {
        this.sio.emit('binary_data', chunk);
      }
    },
    close: () => {
      console.log('Stream closed');
    },
    abort: (err) => {
      console.error('Stream error:', err);
      this.config.callbacks?.onError?.({ audio_status: err.message });
    },
  });

  disconnect(): void {
    if (this.sio.connected) {
      this.sio.disconnect();
    }
  }
}