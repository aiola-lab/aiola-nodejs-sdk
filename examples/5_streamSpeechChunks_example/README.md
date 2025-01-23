# aiOla TTS Stream Speech Example

**Version**: `0.1.0`

This example demonstrates how to use the aiOla TTS SDK to stream text-to-speech audio, collect the recieved data chunk by chunk and save it as a `.wav` file.

---

## How It Works

- Streams text-to-speech audio using the aiOla TTS `/synthesize/stream` endpoint.
- Allows voice selection for the streaming process.
- Saves the streamed audio locally for playback or further processing.

---

## Prerequisites

- **Node.js**: Version 14 or higher.
- **aiOla TTS SDK**: Ensure the SDK is installed and properly configured.

---

## Installation

To install the SDK, run the following command:

```bash
npm install aiola-nodejs-sdk
```

### Local Installation

To install and run the SDK locally:

1. Clone the repository:
```bash
git clone https://github.com/aiola-lab/aiola-nodejs-sdk.git
cd aiola-nodejs-sdk
```
2.	Update the baseUrl and ensure the API endpoint is correct:
   ```javascript
   const baseUrl = '<YOUR_API_BASE_URL>'; // Replace with your API base URL
   ```



## Usage

1.	Run the example:
   ```bash
   npm run streamSpeech_example
   ```
2. The output will display:
	- Progress logs for the synthesis process.
	- A success message with the location of the saved .wav file.

## Code Highlights

### Initialize the TTS Client

```javascript
import { AiOlaTTSClient } from '../../aiola_tts_sdk';

const baseUrl = '<YOUR_API_BASE_URL>';
const bearerToken = '<YOUR_BEARER_TOKEN>';
const ttsClient = new AiOlaTTSClient(baseUrl, bearerToken);
```

### Synthesize Stream in Chunks Speech
```javascript
// Array to hold the received audio chunks
const audioChunks: Buffer[] = [];

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

await ttsClient.synthesizeStreamChunks({ text: text, voice: voice },
   on_chunk_data, on_chunk_end, on_error);
```