import { AiOlaTTSClient } from '../../aiola_tts_sdk';

async function main() {
  const baseUrl = 'https://tesla-testing.internal.aiola.ai/api/tts'; // Replace with your AiOla TTS API base URL (e.g., https://api.aiola.com/tts)
  const bearerToken = 'd1c895ae10ab4a27a0ac3f8860dad306'; // Replace with your Bearer token

  // Instantiate the AiOlaTTSClient with the base URL and Bearer token
  const ttsClient = new AiOlaTTSClient(baseUrl, bearerToken);

  try {
    // Example: Stream Speech
    console.log('Streaming speech...');
    const streamBlob = await ttsClient.synthesizeStream({ text: 'Streaming speech', voice: 'af_bella' });
    console.log('Streaming successful. Saving streamed audio...');

    // Save the streamed audio to a file
    const streamBuffer = Buffer.from(await streamBlob.arrayBuffer());
    require('fs').writeFileSync('streamed_audio.wav', streamBuffer);
    console.log('Audio saved as streamed_audio.wav');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();