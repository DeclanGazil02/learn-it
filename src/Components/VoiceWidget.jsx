import React, { useEffect, useState } from "react";
import { useLeopard } from "@picovoice/leopard-react";
import { Button } from "react-bootstrap";
import axios from "axios";

export default function VoiceWidget() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

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
    if (result?.transcript != undefined && isLoaded) {
      const questObjs = generateQuestionsAPI(result?.transcript)
      // now add to back end
    }
  }, [result])

  const generateQuestionsAPI = async (prompt) => {
    console.log("Generating prompt")

    let questionObjs = []
    try {
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Generate a numbered list of 10 questions, with each question having the question labeled Question: followed by 4 answer choices for each, A: B: C: and D:, then followed by the answer labeled Answer: with the correct answer, only listing A B C or D, from what I say next for each question. The format should look like this: Question 1: This is my question A: An answer for A B: An answer for B C: An answer for C D: An answer for D Answer: B' },
          { role: 'user', content: prompt }],
      }, {
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/json',
        },
      });
      let reply = res.data.choices[0].message.content
      setResponse(reply);
      // now parse through the prompt to create question objects
      const parseQuestionSet = (prompt) => {
        let questionObjs = []
        for (let i = 0; i < 10; i++) {
          // read question
          let afterColon = prompt.indexOf(`Question ${i + 1}: `)
          let firstQuestion = prompt.indexOf("?")
          let question = prompt.substring(afterColon, firstQuestion);
          console.log(question)

          // read A
          let afterA = prompt.indexOf("A:")
          let beforeB = prompt.indexOf("B")

          let answerA = prompt.substring(afterA, beforeB);
          console.log(answerA)

          // read B
          let afterB = prompt.indexOf("B:")
          let beforeC = prompt.indexOf("C:")

          let answerB = prompt.substring(afterB, beforeC);
          console.log(answerB)

          // read C
          let afterC = prompt.indexOf("C:")
          let beforeD = prompt.indexOf("D:")

          let answerC = prompt.substring(afterC, beforeD);
          console.log(answerC)

          // read D
          let afterD = prompt.indexOf("D:")
          let beforeAnswer = prompt.indexOf("Answer:")

          let answerD = prompt.substring(afterD, beforeAnswer);
          console.log(answerD)

          // read Answer
          let afterAnswer = prompt.indexOf("Answer:")
          let beforeNext = prompt.indexOf(`Question ${i + 2}:`)

          if (i === 9) // to stop reading question 11
            beforeNext = prompt.length

          let answer = prompt.substring(afterAnswer, beforeNext);
          console.log(answer)

          prompt = prompt.substring(beforeNext, prompt.length)

          questionObjs.push({
            question: question,
            number: i + 1,
            answerA: answerA,
            answerB: answerB,
            answerC: answerC,
            answerD: answerD,
            answer: answer
          })
        }
      }
      questionObjs = parseQuestionSet(reply)
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Error fetching response');
    }
    console.log(response)
    return questionObjs
  }

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

      <label htmlFor="audio-file">Choose audio file to transcribe: </label>
      <input
        style={{ marginBottom: '20px' }}
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
      <p>{result?.transcript !== undefined && isLoaded ? result?.transcript : "hi"}</p>
    </div>
  );
}
