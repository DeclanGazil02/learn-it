import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Tutors() {
    const [message, setMessage] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
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
                        <p>Upload content goes here</p>
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
                        <div className="flex-grow-1 overflow-auto">
                            <p>Chat content goes here</p>
                            {/* Add more chat messages or components here */}
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
                        <Button type="submit">Send</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Tutors;
