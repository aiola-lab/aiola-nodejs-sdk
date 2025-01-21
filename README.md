# aiOla NodeJS SDKs

Welcome to the **aiOla NodeJS SDKs** repository. This repository contains examples and documentation for various SDKs that integrate with aiOla's Text-to-Speech (TTS) and streaming services.

---

## Examples Overview

### aiOla Streaming SDK

#### 1. [Transcript and Events Example](https://github.com/aiola-lab/aiola-nodejs-sdk/blob/dev/examples/1_transcript_events_example/README.md)
This example demonstrates how to use the aiOla Streaming SDK to capture live transcripts and handle backend-triggered events.

- **Key Features**:
  - Real-time transcription.
  - Event-driven callbacks.

#### 2.[Keyword Spotting Example](https://github.com/aiola-lab/aiola-nodejs-sdk/blob/dev/examples/2_keywords_spotting_example/README.md)

This example shows how to set up keyword spotting using the aiOla Streaming SDK.

- **Key Features**:
  - Spot predefined keywords in live streams.
  - Event-driven keyword matching.

---

### aiOla TTS SDK

#### 3. [Synthesize Speech Example](https://github.com/aiola-lab/aiola-nodejs-sdk/blob/dev/examples/3_synthesizeSpeech_example/README.md)
This example demonstrates how to convert text into speech and download the resulting audio file using the aiOla TTS SDK.

- **Key Features**:
  - Converts text into `.wav` audio files.
  - Supports voice selection.

#### 4. [Stream Speech Example](https://github.com/aiola-lab/aiola-nodejs-sdk/blob/dev/examples/4_streamSpeech_example/README.md)
This example shows how to stream text-to-speech in real-time, enabling audio playback before the entire text is processed.

- **Key Features**:
  - Real-time TTS streaming.
  - Immediate audio playback.

---

## Get Started

1. Clone the repository:
   ```bash
   git clone https://github.com/aiola-lab/aiola-nodejs-sdk.git
   cd aiola-nodejs-sdk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your `<YOUR_API_BASE_URL>` and `<YOUR_BEARER_TOKEN>` and `<YOUR_FLOW_ID>` to the example files.

4. Run the example:
   ```bash
   npm run synthesizeSpeech_example

   npm run streamSpeech_example

   npm run transcript_events_example

   npm run keywords_spotting_example
   ```
