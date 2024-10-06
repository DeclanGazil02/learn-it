import { Schema, model } from 'mongoose';

// Define the option schema for individual questions
const optionSchema = Schema({
    text: { type: String, required: true },
});

// Define the question schema
const questionSchema = Schema({
    number: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }, 
    options: { 
        type: [optionSchema], 
        required: true 
    }
});

// Define the main schema for the user or tutor
const userSchema = Schema({
    email: { type: String, required: true },
    tutorName: { type: String, required: true, unique: true },
    questions: { type: [questionSchema], required: true } // Nesting the question schema
});

const Tutor = model('tutors', userSchema);

export default Tutor;