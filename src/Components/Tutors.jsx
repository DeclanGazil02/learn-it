import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import VoiceWidget from './VoiceWidget';
import './styles.css'; // Import your styles for chat bubble
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Importing the trash icon from react-icons

function Tutors({email}) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // State to hold chat messages
    const [selectedTutor, setSelectedTutor] = useState(''); // State to track selected tutor
    const [tutors, setTutors] = useState([]); // List of available tutors
    const [questions, setQuestions] = useState([])

    const [questionTracker, setQuestionTracker] = useState(0);

    useEffect( () => {
        const getTutorNames = async () => {
            const response = await axios.get(`http://localhost:8080/getTutors/?email=${email}`)
            let suc = response.data.successful
            if(suc){
                console.log(response.data.tutorNames)
                setTutors(response.data.tutorNames)
            }
        }
        getTutorNames()
    }, [])

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() === '') return; // Prevent sending empty messages
        
        if(questionTracker !== 0){
            // check for previous answer
            let prev = questions[questionTracker - 1];
            setMessages((prevMessages) => [...prevMessages, { text: prev.answer, sender: 'bot' }]);
        }


        if(questionTracker === 10)
            setQuestionTracker(0)

        console.log(questions)
        console.log(questionTracker)
        let q = questions[questionTracker]

        let botResponse = q.question
        for(let i = 0; i < q.options.length; i++){
            botResponse += "\n"
            botResponse += q.options[i].text
        }
        setQuestionTracker(questionTracker+1)

        console.log(botResponse)

        // Add the user's message to the messages array
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);

        // Simulate a bot response
        setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: 'bot' }]);

        console.log("Message sent:", message);
        setMessage(''); // Clear the input after sending
    };

    const handleTutorSelect = (tutor) => {
        
        // get api for tutor question set
        const getQuestionSet = async () => {
            const response = await axios.get(`http://localhost:8080/getQuestions/?email=${email}&tutorName=${tutor}`)
            let suc = response.data.successful
            if(suc){
                console.log(response.data.questions)
                setQuestions(response.data.questions)
            }
        }
        getQuestionSet()

        setQuestionTracker(0)

        setSelectedTutor(tutor); // Update selected tutor
        setMessages([]); // Clear chat messages when a new tutor is selected
    };

    // Function to add a tutor
    const addTutor = (tutorName) => {
        setTutors((prevTutors) => [...prevTutors, tutorName]); // Add the new tutor to the list
    };

    return (
        <Container fluid style={{ height: '93vh' }}>
            <Row className="h-100">
                {/* Left side for uploads and tutor information */}
                <Col sm={6} className="p-3 bg-light d-flex flex-column" style={{ height: '100%' }}>
                    {/* Uploads section */}
                    <div className="flex-grow-1">
                        <h2>Uploads</h2>
                        <VoiceWidget addTutor={addTutor} email={email}/> {/* Pass addTutor to VoiceWidget */}
                    </div>

                    {/* Tutors section */}
                    <div className="flex-grow-1">
                        <h2>Tutor Information</h2>
                        <div style={{
                            height: '380px',  // Set a fixed height for the tutor list
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '20px' // Add margin to separate from the chat section
                        }}>
                            {tutors.map((tutor, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleTutorSelect(tutor)}
                                    style={{
                                        padding: '10px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedTutor === tutor ? '#f1f1f1' : 'transparent',
                                        borderRadius: '5px',
                                        marginBottom: '5px'
                                    }}
                                >
                                    {tutor}
                                </div>
                            ))}
                        </div>
                        {/* Display the selected tutor in a fixed space */}
                        <div style={{display:"flex", flexDirection: "row", justifyContent:"space-between"}}>
                            <div style={{ height: '20px' }}>
                                {selectedTutor && (
                                    <p>You selected: {selectedTutor}</p>
                                )}
                            </div>
                            <div>
                                <FaTrash onClick={async () => {
                                    // remove from database
                                    try {
                                        const response = await axios.delete(`http://localhost:8080/deleteTutor`, {
                                            data: { email, tutorName: selectedTutor }
                                        });
                                    
                                        let suc = response.data.successful;
                                        if (suc) {
                                            setSelectedTutor("");
                                            setTutors(tutors.filter(tutor => tutor !== selectedTutor));
                                        }
                                    } catch (error) {
                                        console.error('Error deleting tutor:', error);
                                        // Optionally handle the error (e.g., show a message to the user)
                                    }
                                }}/>
                            </div>
                        </div>
                        
                    </div>
                </Col>

                {/* Right side for chat information */}
                <Col sm={6} className="p-3 bg-white d-flex flex-column" style={{ height: '100%' }}>
                    <div className="flex-grow-1 d-flex flex-column">
                        <h2>Chat</h2>
                        <div className="chat-container flex-grow-1 overflow-auto">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className="chat-bubble" style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                                        color: msg.sender === 'user' ? '#fff' : '#000'
                                    }}>
                                        {msg.text}
                                    </div>
                                ))
                            ) : (
                                <p>Type Start to Chat!</p>
                            )}
                        </div>
                    </div>

                    {/* Footer for message input */}
                    <Form onSubmit={handleSend} className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="primary" type="submit" className="ms-2">Send</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Tutors;
