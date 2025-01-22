import { AiOlaTTSClient } from '../../aiola_tts_sdk';

async function main() {
  const baseUrl = '<YOUR_API_BASE_URL>'; // Replace with your AiOla TTS API base URL (e.g., https://api.aiola.com/tts)
  const bearerToken = '<YOUR_BEARER_TOKEN>'; // Replace with your Bearer token

  // Instantiate the AiOlaTTSClient with the base URL and Bearer token
  const ttsClient = new AiOlaTTSClient(baseUrl, bearerToken);

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