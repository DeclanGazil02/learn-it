import React, { useEffect } from "react";
import { useLeopard } from "@picovoice/leopard-react";
import dotenv from 'dotenv';
import { Button } from "react-bootstrap";

export default function VoiceWidget() {
  const {
    result,
    isLoaded,
    error,
    init,
    processFile,
    startRecording,
    stopRecording,
    isRecording,
  } = useLeopard();

  useEffect(() => {
    const initEngine = async () => {
        await init(
          `KTmOBEvRdEQnvqIvYFaj9cSF5qDX1s2SrTZ02uj0Co6Ux1B53EPKAw==`,
          { publicPath: "/leopard_params.pv" },
          { enableAutomaticPunctuation: true }
        );
      };
    initEngine();
  }, [])
  


  const toggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };
  
  return (
    <div>
      {error && <p className="error-message">{error.toString()}</p>}

      <label htmlFor="audio-file">Choose audio file to transcribe:</label>
      <input
        id="audio-file"
        type="file"
        accept="audio/*"
        disabled={!isLoaded}
        onChange={async (e) => {
          if (!!e.target.files?.length) {
            await processFile(e.target.files[0])
          }
        }}
      />
      <br />
      <label htmlFor="audio-record">Record audio to transcribe:</label>
      <Button id="audio-record" disabled={!isLoaded} onClick={toggleRecord}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button> 
      <h3>Transcript:</h3>
      <p>{result?.transcript}</p>
    </div>
  );
}
