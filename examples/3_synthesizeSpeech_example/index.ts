import { AiOlaTTSClient } from '../../aiola_tts_sdk';
import { AudioFormat } from '../../aiola_tts_sdk/audio-converter';

async function main() {
  const baseUrl = 'https://tesla-testing.internal.aiola.ai/api/tts'; // Replace with your AiOla TTS API base URL (e.g., https://api.aiola.com/tts)
  const bearerToken = 'd1c895ae10ab4a27a0ac3f8860dad306'; // Replace with your Bearer token
  const audioFormat: AudioFormat = 'LINEAR16';

  // Instantiate the AiOlaTTSClient with the base URL and Bearer token
  const ttsClient = new AiOlaTTSClient(baseUrl, bearerToken, audioFormat);

  try {
    // Example: Synthesize Speech
    console.log('Synthesizing speech...');

    const text = 'Hello, this is a test of the TTS synthesis feature. You can download the audio after processing.';
    const audioBlob = await ttsClient.synthesize({ text: text, voice: 'af_bella' });
    console.log('Synthesis successful. Saving audio...');

    // Save the synthesized audio to a file (Node.js example)
    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    require('fs').writeFileSync('synthesized_audio.wav', buffer);
    console.log('Audio saved as synthesized_audio.wav');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();