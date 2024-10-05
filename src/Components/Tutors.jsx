import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import VoiceWidget from './VoiceWidget';
import './styles.css'; // Import your styles for chat bubble

function Tutors() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // State to hold chat messages

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() === '') return; // Prevent sending empty messages

        // Add the new message to the messages array
        setMessages([...messages, message]);
        console.log("Message sent:", message);
        setMessage(''); // Clear the input after sending
    };

    return (
        <Container fluid style={{ height: '93vh' }}>
            <Row className="h-100">
                {/* Left side for uploads and tutor information */}
                <Col sm={6} className="p-3 bg-light d-flex flex-column" style={{ height: '100%' }}>
                    {/* Uploads section */}
                    <div className="flex-grow-1">
                        <h2>Uploads</h2>
                        <VoiceWidget/>
                    </div>

                    {/* Tutors section */}
                    <div className="flex-grow-1">
                        <h2>Tutor Information</h2>
                        <p>Tutor details go here</p>
                    </div>
                </Col>

                {/* Right side for chat information */}
                <Col sm={6} className="p-3 bg-white d-flex flex-column" style={{ height: '100%' }}>
                    <div className="flex-grow-1 d-flex flex-column">
                        <h2>Chat</h2>
                        <div className="chat-container flex-grow-1 overflow-auto">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className="chat-bubble">
                                        {msg}
                                    </div>
                                ))
                            ) : (
                                <p>No messages yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Footer for message input */}
                    <Form onSubmit={handleSend} className="mt-3 d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="me-2" // margin to the right of the input
                        />
                        <Button variant="warning" type="submit">Send</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Tutors;
