import { AiolaStreamingClient } from "../../aiola_streaming_sdk/client" 
import { StreamingConfig } from "../../aiola_streaming_sdk/models/config";
import { RecorderApp } from "../../recorder_app";


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
  console.log(`Events received: ${JSON.stringify(data, null, 2)}`);
};

const onError = (data: any) => {
  console.log(`Error occurred:`, data);
};


const onStreamError = (data: any) => {
  console.log(`Strteam Error received:`, data);
};


async function main() {

  const bearer_token = 'BdGVzbGFpbGFubXVzawodGVzbGFpbGFubXVzawo=pbGFubXVz'

  // Define the SDK configurations
  const config: StreamingConfig = {
    endpoint:  'https://tesla.internal.aiola.ai',
    authType: 'Bearer',
    authCredentials: {
      token: bearer_token
    },
    flowId: 'f38d5001-3b42-405f-b4e3-6caddce456c3',
    namespace: '/events',
    transports: 'pooling',
    executionId: '1009',
    langCode: 'en_US',
    timeZone: 'UTC',
    callbacks: {
      onTranscript,
      onError,
      onEvents,
      onConnect: () => {
        console.log('Connection established');
        client.set_kws(['aiola', 'ngnix']);
      },
      onDisconnect
    }
  };

  // Create SDK client
  const client = new AiolaStreamingClient(config);

  // Define a recording application
  const recorder_app = new RecorderApp(client, onStreamError);

  // Start the recorder
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