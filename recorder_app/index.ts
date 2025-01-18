import { SoxRecording } from "../recorder_app/types/sox";
import {AudioConfig, audioConfigSchema} from "../recorder_app/models/audio"
import { AiolaStreamingError } from "../recorder_app/exceptions";
import { AiolaStreamingClient } from "../sdk/client";


export type AudioData = ArrayBufferLike;

export class RecorderApp {
    private _sdk: AiolaStreamingClient;
    private _onStreamError: any;

    constructor(sdk: AiolaStreamingClient, onStreamError: any) {
      this._sdk = sdk;
      this._onStreamError= onStreamError;
    }
  
    async startStreaming(): Promise<void> {
      try {
        this.startAudioStreaming();
      } catch (error) {
        throw new AiolaStreamingError(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  
    private recording: SoxRecording | null = null; // Keep track of the recording instance
  
    private startAudioStreaming(): void {

      const defaultAudioConfig: AudioConfig = audioConfigSchema.parse({
        sampleRate: 16000,
        channels: 1,
        chunkSize: 4096,
        audioType: "wav",
        dtype: "int16", // Data type for audio samples
      });
  
      // Initialize the recording instance by using the validated configuration
      this.recording = new SoxRecording({
        channels: defaultAudioConfig.channels,
        sampleRate: defaultAudioConfig.sampleRate,
        audioType: defaultAudioConfig.audioType,
        chunkSize: defaultAudioConfig.chunkSize,
      });
  
      //   // Pipe the recording stream to the writable stream
    this.recording
      .stream()
      .pipeTo(this._sdk.writableStream)
      .catch((error) => {
        console.error('Pipe error:', error);
        this._onStreamError?.({ audio_status: error.message });
      });
    }
  
    public closeAudioStreaming(): void {
      console.log("closeAudioStreaming");
  
      // Check if recording is active
      if (this.recording) {
        try {
          // Stop the recording stream
          this.recording.stop(); // Assuming SoxRecording has a stop() method
          console.log("Recording stopped");
        } catch (error) {
          console.error("Error stopping the recording:", error);
        } finally {
          this.recording = null; // Clean up the recording instance
        }
      } else {
        console.warn("No active recording to stop");
      }
    }
  }