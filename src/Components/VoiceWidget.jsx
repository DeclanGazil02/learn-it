import React, { useEffect, useState } from "react";
import { useLeopard } from "@picovoice/leopard-react";
import { Button, Form } from "react-bootstrap"; // Import Form from react-bootstrap
import axios from "axios";

export default function VoiceWidget({ addTutor }) { // Accept addTutor as a prop
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [tutorName, setTutorName] = useState(''); // State for tutor name input

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

  useEffect(() => {
    setPrompt(result?.transcript)
    if (result?.transcript !== undefined && isLoaded) {
      const questObjs = generateQuestionsAPI(result?.transcript);
      // now add to back end
    }
  }, [result])

  const generateQuestionsAPI = async (prompt) => {
    console.log("Generating prompt");

    let questionObjs = [];
    try {
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Generate a numbered list of 10 questions...' },
          { role: 'user', content: prompt }],
      }, {
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          'Content-Type': 'application/json',
        },
      });

      let reply = res.data.choices[0].message.content;
      setResponse(reply);

      const parseQuestionSet = (prompt) => {
        let questionObjs = [];
        // Parsing logic
        return questionObjs;
      }
      questionObjs = parseQuestionSet(reply);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Error fetching response');
    }
    console.log(response);
    return questionObjs;
  }

  const toggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  // Function to handle adding a tutor
  const handleAddTutor = (e) => {
    e.preventDefault();
    if (tutorName.trim() === '') return; // Prevent adding empty tutor names

    addTutor(tutorName); // Call the passed function to add the tutor
    setTutorName(''); // Clear the input field
  };

  return (
    <div>
      {error && <p className="error-message">{error.toString()}</p>}

      {/* Choose audio file to transcribe */}
      <label htmlFor="audio-file">Choose audio file to transcribe: </label>
      <input
        style={{ marginBottom: '20px' }}
        id="audio-file"
        type="file"
        accept="audio/*"
        disabled={!isLoaded}
        onChange={async (e) => {
          if (!!e.target.files?.length) {
            await processFile(e.target.files[0]);
          }
        }}
      />
      <p>{result?.transcript !== undefined && isLoaded ? result?.transcript : "hi"}</p>

      {/* Tutor Name Input Form on the same line */}
      <Form onSubmit={handleAddTutor} className="d-flex align-items-stretch mb-3"> {/* Use align-items-stretch */}
        <Form.Control
          type="text"
          placeholder="Tutor Name"
          value={tutorName}
          onChange={(e) => setTutorName(e.target.value)}
          className="me-2" // Add margin to the right of the input
        />
        <Button variant="primary" type="submit" className="h-100"> {/* Add h-100 class */}
          Add Tutor
        </Button>
      </Form>
    </div>
  );
}
