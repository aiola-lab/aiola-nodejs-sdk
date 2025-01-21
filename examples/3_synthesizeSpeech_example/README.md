# aiOla TTS Synthesize Speech Example

**Version**: `0.1.0`

This example demonstrates how to use the aiOla TTS SDK to convert text into speech and save the resulting audio as a `.wav` file.

---

## How It Works

- Converts text into a `.wav` audio file using the aiOla TTS `/synthesize` endpoint.
- Allows voice selection for speech synthesis.
- Saves the synthesized audio locally for playback or further processing.

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
   npm run synthesizeSpeech_example
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
const audioBlob = await ttsClient.synthesize({ text: text, voice: 'af_bella' });
```

### Save Audio to File
```javascript
const buffer = Buffer.from(await audioBlob.arrayBuffer());
require('fs').writeFileSync('synthesized_audio.wav', buffer);
```
