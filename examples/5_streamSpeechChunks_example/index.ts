import { AiOlaTTSClient } from '../../aiola_tts_sdk';
import * as fs from 'fs';

async function main() {
  const baseUrl = '<YOUR_API_BASE_URL>'; // Replace with your AiOla TTS API base URL (e.g., https://api.aiola.com/tts)
  const bearerToken = '<YOUR_BEARER_TOKEN>'; // Replace with your Bearer token

  // Instantiate the AiOlaTTSClient with the base URL and Bearer token
  const ttsClient = new AiOlaTTSClient(baseUrl, bearerToken);

  // Array to hold the received audio chunks
  const audioChunks: Buffer[] = [];

  try {
    // Example: Stream Speech
    console.log('Streaming speech...');

    const on_chunk_data = (chunk: Buffer) => {
      // Collect each chunk of data
      audioChunks.push(chunk);
    };

    const on_chunk_end = () => {
      console.log('Response fully received');

      // Concatenate all collected chunks into a single buffer
      const audioBuffer = Buffer.concat(audioChunks);

      // Define the output file path
      const outputFilePath = 'streamed_chunks_audio.wav';

      // Write the buffer to a WAV file
      fs.writeFile(outputFilePath, audioBuffer, (err) => {
        if (err) {
          console.error('Error writing the WAV file:', err);
        } else {
          console.log(`Audio saved successfully as ${outputFilePath}`);
        }
      });
    };

    const on_error = (error: Error) => {
      console.error('Stream error:', error.message);
    };

    const text = 'Hello, this is a test of the TTS synthesis feature. You can download the audio after processing.';
    const voice = 'af_bella';

    await ttsClient.synthesizeStreamChunks(
      { text: text, voice: voice },
      on_chunk_data,
      on_chunk_end,
      on_error
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();