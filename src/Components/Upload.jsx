import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './styles.css';

function Upload() {
    const [count, setCount] = useState(0);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={3}>
                        Upload
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" placeholder="Upload Link" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                    <Form.Label column sm={3}>
                        Title
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" placeholder="Project Title" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 9, offset: 3 }}>
                        <Button type="submit">Sign in</Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}

export default Upload;
