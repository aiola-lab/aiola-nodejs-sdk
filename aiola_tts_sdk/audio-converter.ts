import { AudioContext } from 'web-audio-api';

export type AudioFormat = 'LINEAR16' | 'MULAW' | 'PCM';

/**
 * Converts audio data to the specified format
 */
export async function convertAudioFormat(audioBlob: Blob, format: AudioFormat): Promise<Blob> {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Create an offline context for rendering
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  // Create a buffer source
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  
  let formatConfig: { bitsPerSample: number, encoding: string };
  switch (format) {
    case 'LINEAR16':
      formatConfig = { bitsPerSample: 16, encoding: 'linear' };
      break;
    case 'MULAW':
      formatConfig = { bitsPerSample: 8, encoding: 'mu-law' };
      break;
    case 'PCM':
      formatConfig = { bitsPerSample: 16, encoding: 'linear' };
      break;
    default:
      throw new Error(`Unsupported audio format: ${format}`);
  }

  // Connect and start rendering
  source.connect(offlineContext.destination);
  source.start(0);
  
  const renderedBuffer = await offlineContext.startRendering();
  
  // Convert to the desired format
  const numberOfChannels = renderedBuffer.numberOfChannels;
  const length = renderedBuffer.length;
  const sampleRate = renderedBuffer.sampleRate;
  
  // Create the audio data based on format
  const audioData = new Float32Array(length * numberOfChannels);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = renderedBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      audioData[i * numberOfChannels + channel] = channelData[i];
    }
  }

  // Convert to specified format
  let outputData: Int16Array | Uint8Array;
  if (format === 'MULAW') {
    outputData = convertToMulaw(audioData);
  } else {
    outputData = convertToLinear16(audioData);
  }

  return new Blob([outputData], { type: 'audio/wav' });
}

function convertToLinear16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array;
}

function convertToMulaw(float32Array: Float32Array): Uint8Array {
  const MULAW_BIAS = 33;
  const mulawArray = new Uint8Array(float32Array.length);
  
  for (let i = 0; i < float32Array.length; i++) {
    let sample = float32Array[i];
    
    // Convert to 16-bit PCM first
    sample = sample * 32768;
    
    // Compute mu-law value
    const sign = (sample < 0) ? 0x80 : 0;
    if (sample < 0) sample = -sample;
    sample = Math.min(sample, 32635);
    
    sample += MULAW_BIAS;
    const exponent = Math.floor(Math.log(sample) / Math.log(2));
    const mantissa = Math.floor(sample * Math.pow(2, -exponent) * 16) & 0x0F;
    
    mulawArray[i] = ~(sign | ((exponent & 0x07) << 4) | mantissa);
  }
  
  return mulawArray;
} 