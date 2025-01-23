export type AudioFormat = 'LINEAR16' | 'PCM';

/**
 * Converts audio data to the specified format
 */
export async function convertAudioFormat(audioBlob: Blob, format: AudioFormat): Promise<Blob> {
  const buffer = Buffer.from(await audioBlob.arrayBuffer());

  // Get the appropriate Blob implementation
  const BlobImpl = typeof Blob !== 'undefined' ? Blob : require('buffer').Blob;

  switch (format) {
    case 'LINEAR16':
      return new BlobImpl([convertToLinear16(buffer)]);
    case 'PCM':
      return new BlobImpl([buffer]);
    default:
      throw new Error(`Unsupported audio format: ${format}`);
  }
}

function convertToLinear16(buffer: Buffer): Buffer {
  const samples = new Int16Array(buffer.length / 2);
  for (let i = 0; i < buffer.length; i += 2) {
    samples[i / 2] = buffer.readInt16LE(i);
  }
  return Buffer.from(samples.buffer);
}