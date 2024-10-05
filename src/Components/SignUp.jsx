import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
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
      
      console.log("trying")
      // Send a request to your server
      const response = await axios.get(`http://localhost:8080/checkUserEmail/?email=${email}`)
      let userEmailFound = response.data.found 
      console.log("did")

      if(userEmailFound)
        setErrors({email: "Email already in use."})
      else{ // create account and redirect
        try {
          const response = await axios.post('http://localhost:8080/addUser', {
            email,
            password,
          });
      
          if (response.data.successful) {
            console.log('User added successfully!');
            navigate("/upload")
          } else {
            console.error('Failed to add user:', response.data.message);
            setErrors({email: "Failed to add user."})
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
        <h2 className="login-title">Sign-Up</h2>
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
            Create Account
          </Button>

          <div className="create-account-text">
            <p>Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}


export default Login;
