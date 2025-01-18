import { AiolaStreamingClient } from "../sdk/client";
import { StreamingConfig } from "../sdk/models/config";
import { RecorderApp } from "../recorder_app";


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
  console.log(`Strteam Error received:`, data);
};


async function main() {

  // Define the SDK configurations
  const config: StreamingConfig = {
    endpoint:  'https://shahar.internal.aiola.ai',
    authType: 'x-api-key',
    authCredentials: {
      api_key: "eyAiYWNjZXNzX3Rva2VuIjogImV5SnJhV1FpT2lJeWVsQmNMMjl1ZEZ3dlVqWXhWRGRJVEhKbmNFVkxSMnA0TTJ0WEsxSlZNelkyVlVjeVJrbE9VVlJzUzAwOUlpd2lZV3huSWpvaVVsTXlOVFlpZlEuZXlKemRXSWlPaUl6TWpNMVl6UXdOQzFqTURJeExUY3dZVFV0WW1SbE1TMHpOMlZqWVdabU1tSTFOREFpTENKcGMzTWlPaUpvZEhSd2N6cGNMMXd2WTI5bmJtbDBieTFwWkhBdVpYVXRkMlZ6ZEMweExtRnRZWHB2Ym1GM2N5NWpiMjFjTDJWMUxYZGxjM1F0TVY5VVoyNUhURE5EY1RnaUxDSmpiR2xsYm5SZmFXUWlPaUkyTlRCcmEyMHljVE4xYkhKb2FEWTRaV3hzYW1SeGFIVTRNeUlzSW05eWFXZHBibDlxZEdraU9pSXlNVFUzT1RneU5DMW1ORE15TFRRMU1UVXRPVE5sTXkweFl6RmxORE0yWlRNMFl6SWlMQ0psZG1WdWRGOXBaQ0k2SWpFeE0yTm1ORFl6TFRGall6UXROREl4WmkxaE5HWmhMVFJtT1dGbU9EWTVNMlZsTWlJc0luUnZhMlZ1WDNWelpTSTZJbUZqWTJWemN5SXNJbk5qYjNCbElqb2lZWGR6TG1OdloyNXBkRzh1YzJsbmJtbHVMblZ6WlhJdVlXUnRhVzRpTENKaGRYUm9YM1JwYldVaU9qRTNNelk1TWpVeE1EWXNJbVY0Y0NJNk1UY3pOekF4TVRVd05pd2lhV0YwSWpveE56TTJPVEkxTVRBMkxDSnFkR2tpT2lJMVpUQTJNbUl6TXkwMFlXTXlMVFE1TWpFdFlqZ3hOUzFrWVdFMU5UZzFOakJrWTJNaUxDSjFjMlZ5Ym1GdFpTSTZJblpzWVdSNWMyeGhkaTVpZFhOb2JXVnViM1l1YzJoaGFHRnlJbjAuT2FTYVRGMTZ0UC1yUDF3TUtXRVNHSHpNSDlxdWpaeGlGZ1plMEpvaG91cGhpaVRiT1lxY0dDcmZLMU5sUE9vMXB0MnJTM0lFdlRvMkxyb2JuQ3pzYUNJUjhGRGtuS2RDbUJRY3F5NFFIV2trLWNsWmU5OW5RVWIzMUFUSmNQaUM3MGxUOUhNT1ZNWGhDeUEtX1BwVDJnZG9aRmhKMFMtX20xMDI4dFl0ZmRRM05DOTRqejhTNTEwRXVLTVNySmF3Q05jd29RT01Rcm5Kb0NSbDdXVUdlOHFQS3A1a2dTVWNVX3c4MzRXcjNLN0ZISGxYOXZUWE1BNndzeDRqekVHaVQ0MmU5aXl0eXdTbWdFbjdDUWo3YlZTcGh2Y3ZQZ0JsS2JGUHkzSkRsbEU3eW1vSURTbHBvc3h4NHd4bEFjdlJKdzh6SlJjcmpld3pFN0F5ZzJmeVFRIiwgInJlZnJlc2hfdG9rZW4iOiAiZXlKamRIa2lPaUpLVjFRaUxDSmxibU1pT2lKQk1qVTJSME5OSWl3aVlXeG5Jam9pVWxOQkxVOUJSVkFpZlEuRkh1dFF3ODVvbVFTeFBlcGVXX2R2dXZDNDEyMEFxRWtRWVBEX0I2MVRUWmZzOGpVUURpR0RZeDZpWUhicFZSaFlReFY4cGsyZmoxR1RUSk5kUFdfdlFsMmlqN2RIVFJPQTZLbzJ4bkpIeWpKMl9KRkF1TkhIRGg3SnhtZzJNUUxMYkV1eEc3ckxQQ1QyZFBMeGxDT3hEX3FtMFdRLTRzZDA0dEJIOWNVOWtYYnF2Tmo5aXNrUi1udFR0Z0NrbXlHTzIyR3FBNUo4V3lHYUs5UFYzdmFOemxac2pwSTlwaU9JNGVLQy1nZUNtZnFsMEQxMDdWRmFjWXdvX3BiQ2RuendaOVlOWUtiVkxta2t3RHBYYmpmeWJVTXlTSVA4SUlIWl9MSUZSZzZXOGU4TG0wTkZNM0FHMG9rX3RRUU5BbWVGMHA4dEZzRUkxNWpTcEpJVFFYcDdnLjFidUVYOUZnN1Z1QnNjVC0uNkxmX2dmUHF6ZjVGaU9wdGN4YldaRU1zSWphLTdNeFhSUXpoLVJPRTB1cEhhbkNwdkJ0Z0NBbVZ4M01yalozTUh0eVpKU1ZUQzBXRzRmWnJkTUsyb0FjRzhvdlpvOFVsbVBoT0MyQ0hnb2pabjloQ2k4LWlNMklJZGl3RHRBbXZzS2tsZUdOOFgzcU42ZlM2QWxoZ2VjRURPYlJLU01FQTg3eEZhZ1Y5ek1oSjR1OTgyLU5UVnd0dENYc3MyNkI2WG5WU3dGcXBZbS1raTVsT2Q0eFZNZGdXTERTdXp3cXIzVWpyTmZKdUU0eFU2NUZKVUZwbko1dEdhWUo1aU10OWs3WGVQa2ZSOWI1Q2c4ODNNSFUxSkJhT1ZicjhQWldIc1JMcHVCY2NlYU51MVNLVDM1SFhjRG5lTklheW5GRWVPbUtmYTU0NklwaHNGMmg0R1V3WVprbEttaG1FRVNPWXNMM1pFeldiX1pZMFh1SzlqMXdjRHNKN096TThXR21lU09NREh4ZFhrbl9nd2NfdVVidXF5Y2dTSm5CWlZON3oxTWFudFRZcV9iUXRDNTBaNG5kS2I5MlZ4eWdURld0U2xtOC1ncGctekFRWnE2NlVXV2hsTjBQc2pFQ1ZXYTIzcTJvSDlHQmxoZnhvQVVJV0Y2N2ZJdVI0ck9WTjhLZ21aM1RVLTJTRzV1YTh1dUIyazE1TTRtMFBHRFUxNFVLb0dJWnZpOWVPMjNvb08wZXlXUk1pbEdVU1JaaDFReVVjV0E0NXVSZG1JLTRDMHIwMTZvQ0JLb3dlN2t6ZVVRVjBkVjdyc2VZem1CellRRjNvV1d6dVplM2pLMGRySUx3dXdhWWttWUhwQzFHYWt3cHcwUmpLVFkxb0ZXTFRBVW1ZdmxpN091cmVDTUdkQU45bkE1TUFKUWUxRGl2T2FzR0JDdC1TSk9JU2k4d1l1M3hHRTdUM3pGaThSTmdLc0RsVUZZUE1faXhJdlh5RU9QVkhZMFlkUm5COVdhc2I2NkJqR2VPcW5CZHVVMktHV1hHUHpVOGNiMzZhOS1xWHlTS0d6ajR2MG9sU2pSVmdtMmtHcDdWTjVUZkkyQ2FuRHFTQmlmYWZkUlpUOGs1NGRMcnB4czFpdGRSemlwc183NGZyNU42MUhsMFlycXdhYW9aekl2eVlvVWNESTcxMDVJYjMxczY4VWNyZWVteXhUa2JnbEs1eUhfemdoTDRUYW9Lai10S2FWZ3VkUUZnMEZvTTl0bXg2d1RZdFFXTURtSndabEVpU1lXbU5wVGtaaFJMQUJtS2JxVFJqSmJ6bzdTaS11a25Md3RiSFc3WUUxMndNR1RzRV9wbGVxNExNODhlNk1MXzQteW5EVUhuc3dEOVloZ2RkNV90eV9wOFozMFVhN2xNUGFPRmZha3hUYTJoUVR4UExpN3lBaUpDZTAyek92TFF2N3pyU3R1MjNhU1hZOWZ1YVhuR0xpeWIwZU5jUUlENHZHV2ZrZHpNT0RIYk1MZTBfSkZ0VGo3RllobElVNXNjMzlBeVdVZGlINzRMVnRrOG11RmZXWUgwaWR4NFdNcjNsMm1EbDNzdnlOcy1GUi1FUm1PSXdwTGxMcGo4aUhBQlVidnJ3eXJLY3ZVcVF2UWZETi1QalFyY2xxaXQ0N2xFeDRwTC13Q3FJTDRndHcxR2RwdDhBMVJySVRzbzJsbFh6bzRjWEVqVkwxSWw1T3ozSHFZZXhDNU9Pa1ZzQW4xRGZsUXZGLmNXTWxsWDVjcVdWVHZtTk04MDJVSFEiLCAiaWRfdG9rZW4iOiAiZXlKcmFXUWlPaUoxVkdFMVRVRlFUSFJ4WmtNeVkzUlVaV1pRWEM5VVVHeHNRalpQT1V0cVFWTllOVWQ0YkZkdFUza3lORDBpTENKaGJHY2lPaUpTVXpJMU5pSjkuZXlKemRXSWlPaUl6TWpNMVl6UXdOQzFqTURJeExUY3dZVFV0WW1SbE1TMHpOMlZqWVdabU1tSTFOREFpTENKbGJXRnBiRjkyWlhKcFptbGxaQ0k2ZEhKMVpTd2lhWE56SWpvaWFIUjBjSE02WEM5Y0wyTnZaMjVwZEc4dGFXUndMbVYxTFhkbGMzUXRNUzVoYldGNmIyNWhkM011WTI5dFhDOWxkUzEzWlhOMExURmZWR2R1UjB3elEzRTRJaXdpWTI5bmJtbDBienAxYzJWeWJtRnRaU0k2SW5ac1lXUjVjMnhoZGk1aWRYTm9iV1Z1YjNZdWMyaGhhR0Z5SWl3aVkzVnpkRzl0T25SbGJtRnVkRjlwWkNJNkluTm9ZV2hoY2lJc0ltZHBkbVZ1WDI1aGJXVWlPaUoyYkdGa2VYTnNZWFlpTENKamRYTjBiMjA2WjNKdmRYQnpJam9pUkdWMlpXeHZjRzFsYm5RaUxDSnZjbWxuYVc1ZmFuUnBJam9pTWpFMU56azRNalF0WmpRek1pMDBOVEUxTFRrelpUTXRNV014WlRRek5tVXpOR015SWl3aVlYVmtJam9pTmpVd2EydHRNbkV6ZFd4eWFHZzJPR1ZzYkdwa2NXaDFPRE1pTENKbGRtVnVkRjlwWkNJNklqRXhNMk5tTkRZekxURmpZelF0TkRJeFppMWhOR1poTFRSbU9XRm1PRFk1TTJWbE1pSXNJblJ2YTJWdVgzVnpaU0k2SW1sa0lpd2lZWFYwYUY5MGFXMWxJam94TnpNMk9USTFNVEEyTENKbGVIQWlPakUzTXpjd01URTFNRFlzSW1saGRDSTZNVGN6TmpreU5URXdOaXdpWm1GdGFXeDVYMjVoYldVaU9pSmlkWE5vYldWdWIzWWlMQ0pxZEdraU9pSmtPR0UzT0dOallTMDRZbUUyTFRSbU56UXRPVE5qTVMxak1XSTNNV00yTnprNVpXWWlMQ0psYldGcGJDSTZJblpzWVdSNWMyeGhkaTVpZFhOb2JXVnViM1pBWVdsdmJHRXVZMjl0SW4wLkNtTVZjUzRIZU1HVXk3MHBBekV6Y0lNMEJWYy1BVVFiZ004am9aVGp5TTIxVnpiOE5lQWhqSnhSWUVPVkNfUURSRElvdEF1MU1FUGU0VTJReGs0ZlBUVktELWpJdkVFc3hpVV9jOG9MY0lXR3VHeC1WX3VxR0lJRllhN20wQzJpY1VYcENoNXJCS0pNcHlCVDVqMVNnUVVhcjQxQkY1N1lYNzk2cHhKVXV0UjZMSXlobHVXeVc4dTZWVzJ1TU0tZ1FxcDAwMVBUcFcxc19UUXhSRi1JQ3lXVmxQUHdON0xyb0ViY3FqalRiN2pMYUI1THJHX0lTTnFKVlItSU4wQzd4YkFhZjZEbl95eDE1OW15WVk5WHJYTmZUNzZwZVVJcFRSLU85X3dYb2kyeFBPQjMzYVNBZWpCc2NqbU0zS1N2d2dIZW05YTc1OGp4REcxdlE1Sk5YdyIgfQo"
    },
    flowId: 'f38d5001-3b42-405f-b4e3-6caddce456c3',
    namespace: '/events',
    transports: ['polling'],
    executionId: '1',
    langCode: 'en_US',
    timeZone: 'UTC',
    callbacks: {
      onTranscript,
      onError,
      onEvents,
      onConnect,
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