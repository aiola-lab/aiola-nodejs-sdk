# Aiola Streaming SDK

**Version**: `0.1.0`  
**Description**: A Node.js SDK for interacting with the Aiola Streaming Service, featuring real-time audio streaming and processing capabilities.

---

## Features

- **Real-Time Audio Streaming**: Stream audio to the Aiola service with configurable settings.
- **Customizable Audio Configuration**: Define sample rate, channels, and chunk size for your audio streams.
- **Seamless Integration**: Uses `socket.io-client` for communication and `node-record-lpcm16` for audio capture.
- **Type Safety**: Developed in TypeScript with type definitions for all core components.

---

## Installation

To install the SDK, run the following command:

```bash
npm install aiola-nodejs-sdk
```
---

## Requirements

- **Node.js**: Version 14 or higher
- **Dependencies**:
  - `node-record-lpcm16`
  - `socket.io-client`
  - `zod`

---

## What in the Project

- **`recorder_app`**: An example of audio streaming configuration and recording logic, which using aiola SDK.
- **`sdk`**: Contains the core logic for interacting with Aiola’s streaming service.

---

## Audio Configuration

The `recorder_app` uses a configurable schema defined as follows:

| Property     | Type    | Default  | Description                              |
|--------------|---------|----------|------------------------------------------|
| `sampleRate` | `number`| `16000`  | Sample rate in Hz                        |
| `channels`   | `number`| `1`      | Number of audio channels (Mono = 1)      |
| `chunkSize`  | `number`| `4096`   | Size of each audio chunk in bytes        |
| `dtype`      | `string`| `'int16'`| Data type for audio samples              |

---

<br><br>


# Example Application: Using the SDK and RecorderApp

Below is a complete example of how to use the **Aiola Streaming SDK** with the RecorderApp to stream audio, process events, and handle transcripts in real time.

## Code Example

```javascript
import { AiolaStreamingClient } from "../sdk/client";
import { StreamingConfig } from "../sdk/models/config";
import { RecorderApp } from "../recorder_app";

// Define event callbacks
const onConnect = () => {
  console.log('Connection established');
};

const onDisconnect = (duration: number, totalAudio: number) => {
  console.log(`Connection closed. Duration: ${duration}ms, Total audio: ${totalAudio}ms`);
};

const onTranscript = (data: any) => {
  console.log(`Transcript received: ${data.transcript}`);
};

const onEvents = (data: any) => {
  console.log(`Events received:`, data);
};

const onError = (data: any) => {
  console.log(`Error occurred:`, data);
};

const onStreamError = (data: any) => {
  console.log(`Stream Error received:`, data);
};

async function main() {

// Define the SDK configuration
  const config: StreamingConfig = {
        endpoint: `<endpoint>`,  // The URL of the Aiola server
        authType: "Bearer",  // Supported authentication for the API
        authCredentials: {
        token: `<your_bearer_token_here>` // Bearer Token key, obtained upon registration with Aiola
        },
        flowId: `<flow_id_here>`, // One of the IDs from the flows created for the user
        namespace: '/events', // Namespace for subscription: /transcript (for transcription) or /events (for transcription + LLM solution)
        transports: 'polling', // Communication method: 'websocket' for L4 or 'polling' for L7
        executionId: '1', // Unique identifier to trace execution
        langCode: 'en_US', // Language code for transcription
        timeZone: 'UTC', // Time zone for timestamp alignment
        callbacks: {
        onTranscript,       // Callback for transcript data
        onError,            // Callback for handling errors
        onEvents,           // Callback for event-related data
        onConnect,          // Callback for connection establishment
        onDisconnect        // Callback for connection termination
        }
    };
  // Create an SDK client
  const client = new AiolaStreamingClient(config);

  // Define a RecorderApp
  const recorder_app = new RecorderApp(client, onStreamError);

  // Start streaming
  await recorder_app.startStreaming();

  console.log("Application is running. Press Ctrl+C to exit.");

  process.on("SIGINT", async function () {
    console.log();
    console.log("Stopping recording");
    recorder_app.closeAudioStreaming();
    console.log("Closing real-time transcript connection");
    process.exit();
  });
}

main().catch(console.error);
```

### Explanation of Configuration Parameters

| Parameter	                  | Type	     | Description                                                                                                                          |
|-----------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `endpoint`	              | `string`     | The base URL of the Aiola server                                                                                                     |
| `authType`	              | `string`     |  The authentication type, currently supporting "Bearer".                                                                          |
| `authCredentials` 	      | `object`     |  An object containing credentials required for authentication.                                                                       |
| `authCredentials.token`   |	`string`     |  The Bearer token, obtained during registration with Aiola.                                                                               |
| `flowId`	                  |	`string`     |  A unique identifier for the specific flow created for the user.                                                                     |
| `namespace`	              |	`string`     |  The namespace to subscribe to. Use /transcript for transcription or /events for transcription + LLM integration.                    |
| `transports`	              |	`string[]`   |  The communication method. Use ['websocket'] for Layer 4 (faster, low-level) or ['polling'] for Layer 7 (supports HTTP2, WAF, etc.). |
| `executionId`	              |	`string`     |  A unique identifier to trace the execution of the session. Defaults to "1".                                                         |
| `langCode`	              |	`string`	 |  The language code for transcription. For example, "en_US" for US English.                                                           |
| `timeZone`	              |	`string`	 |  The time zone for aligning timestamps. Use "UTC" or any valid IANA time zone identifier.                                            |
| `callbacks`	              |	`object`	 |  An object containing the event handlers (callbacks) for managing real-time data and connection states                               |

<br>

### Supported Callbacks

| Callback	| Description |
|-----------|-------------|
|`onTranscript` |	Invoked when a transcript is received from the Aiola server. |
|`onError` |	Triggered when an error occurs during the streaming session. |
|`onEvents` |	Called when events (e.g., LLM responses or processing events) are received. |
|`onConnect` |	Fired when the connection to the Aiola server is successfully established. |
|`onDisconnect` |	Fired when the connection to the server is terminated. Includes session details such as duration and total audio streamed. |

---

### How It Works

1.	Endpoint:
    -	This is the base URL of the Aiola server where the client will connect.
2.	Authentication:
    -	The SDK uses x-api-key for authentication. The API key must be obtained during registration with Aiola.
3.	Namespace:
    -	Determines the type of data you want to subscribe to:
    -	`/transcript`: For transcription data only.
    -	`/events`: For transcription combined with LLM solution events.
4.	Transport Methods:
    -	Choose between:
        -	`'websocket'`: For **Layer 4** communication with lower latency.
        -	`'polling'`: For **Layer 7** communication, useful for environments with firewalls or HTTP2 support.
5.	Callbacks:
    -	These are functions provided by the user to handle various types of events or data received during the streaming session.
6.	Execution ID:
    -	Useful for tracing specific execution flows or debugging sessions.
7.	Language Code and Time Zone:
    -	Ensure the transcription aligns with the required language and time zone.