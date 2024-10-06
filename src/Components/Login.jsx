import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login({email, setEmail}) {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      // Send a request to your server
      console.log("trying")
      const response = await axios.get(`http://localhost:8080/checkUserEmail/?email=${email}`)
      let userEmailFound = response.data.found 

      if(!userEmailFound)
        setErrors({email: "This account does not exist."})

      else{
        try {
          const response = await axios.post('http://localhost:8080/attemptLogin', {
            email,
            password
          });
      
          if (response.data.successful) {
            console.log('Sign in successful');
            setEmail(email)
            navigate("/tutors")
          } else {
            console.error('Failed to sign in:', response.data.message);
            setErrors({email: "Incorrect Password or User Name."})
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
      
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>


          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>



          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>

          <div className="create-account-text">
            <p>Don't have an account? <Link to="signup">Create account</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}


export default Login;
