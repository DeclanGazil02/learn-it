// src/OpenAIChat.js
import React, { useState } from 'react';
import axios from 'axios';

const OpenAIChat = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            }, {
                headers: {
                    'Authorization': `sk-BeUtmTLDZlRzMkO3XCNYB17jeetNk1MLiFnkMZ47BmT3BlbkFJM4wTYaHGjuWI9uplZTrCtte1tAN2WKvkKA53I11XcA`, // Replace with your API key
                    'Content-Type': 'application/json',
                },
            });
            setResponse(res.data.choices[0].message.content);
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
