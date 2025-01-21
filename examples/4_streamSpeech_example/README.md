# aiOla TTS Stream Speech Example

**Version**: `0.1.0`

This example demonstrates how to use the aiOla TTS SDK to stream text-to-speech audio and save it as a `.wav` file.

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

## Setup

1. Install dependencies:
```bash
npm install
```
2.	Update the baseUrl and ensure the API endpoint is correct:
   ```javascript
   const baseUrl = 'https://tesla.internal.aiola.ai/api/tts'; // Replace with your API base URL
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

const baseUrl = 'https://tesla.internal.aiola.ai/api/tts';
const ttsClient = new AiOlaTTSClient(baseUrl);
```

### Synthesize Speech
```javascript
const text = 'Hello, this is a test of the aiOla TTS synthesis feature.';
const streamBlob = await ttsClient.synthesizeStream({ text: text, voice: 'af_bella' });
```

### Save Audio to File
```javascript
const streamBuffer = Buffer.from(await streamBlob.arrayBuffer());
require('fs').writeFileSync('streamed_audio.wav', streamBuffer);
```
