// src/OpenAIChat.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OpenAIChat = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => { // used to create tutors
        e.preventDefault();
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
                for(let i = 0; i < 10; i++){
                    // read question
                    let afterColon = prompt.indexOf(`Question ${i+1}: `)
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
                    let beforeNext = prompt.indexOf(`Question ${i+2}:`)
    
                    if(i === 9) // to stop reading question 11
                        beforeNext = prompt.length
    
                    let answer = prompt.substring(afterAnswer, beforeNext);
                    console.log(answer)
    
                    prompt = prompt.substring(beforeNext, prompt.length)
    
                    questionObjs.push({
                        question: question,
                        number: i+1,
                        answerA: answerA,
                        answerB: answerB,
                        answerC: answerC,
                        answerD: answerD,
                        answer: answer
                    })
                }
            }   
            const questionObjs = parseQuestionSet(reply)
        } catch (error) {
            console.error('Error fetching response:', error);
            setResponse('Error fetching response');
        }
    };


    return (
        <div>
            <h1>OpenAI Chat</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="4"
                    cols="50"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your message here..."
                />
                <br />
                <button type="submit">Send</button>
            </form>
            {response && (
                <div>
                    <h2>Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default OpenAIChat;
