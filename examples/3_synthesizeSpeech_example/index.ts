import { AiOlaTTSClient } from '../../aiola_tts_sdk';

async function main() {
  const baseUrl = 'https://tesla.internal.aiola.ai/api/tts'; // Replace with your API base URL
  const ttsClient = new AiOlaTTSClient(baseUrl);

  try {
    // Example: Synthesize Speech
    console.log('Synthesizing speech...');

    const text = 'Hello, this is a test of the aiOla TTS synthesis feature. You can download the audio after processing.';
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