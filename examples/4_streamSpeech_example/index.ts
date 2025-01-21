import { AiOlaTTSClient } from '../../aiola_tts_sdk';

async function main() {
  const baseUrl = 'YOUR_API_BASE_URL'; // Replace with your AiOla TTS API base URL
  const ttsClient = new AiOlaTTSClient(baseUrl);

  try {
    // Example: Stream Speech
    console.log('Streaming speech...');
    const streamBlob = await ttsClient.synthesizeStream({ text: 'Streaming aiOla speech', voice: 'af_bella' });
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