import dotenv from 'dotenv';
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bcrypt from 'bcrypt' // for password hasing

import User from './Schemas/User.js'

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.json({ message: "Hello from the server!!"}); // Example response
});

app.get('/checkUserEmail', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ found: false, message: 'Email required' });
  }

  const user = await User.findOne({email: email})

  if(user){
    res.json({ found: true }); // Example response
    console.log("Found")
  }
  else{
    res.json({ found: false }); // Example response
  }
});

app.post('/addUser', async (req, res) => {
  // Get data from the request body
  const { email, password } = req.body;
  console.log(email, password)
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ successful: false, message: 'Email and password are required' });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ successful: true });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ successful: false, message: 'Internal Server Error' });
  }
});

app.post('/attemptLogin', async (req, res) => {
 // Get data from the request body
 const { email, password } = req.body;
 // Basic validation
 if (!email || !password) {
   return res.status(400).json({ successful: false, message: 'Email and password are required' });
 }

 try {
   // Hash the password before saving
   const hashedPassword = await bcrypt.hash(password, 10);

   // Save the user
   const user = await User.findOne({email: email, password: hashedPassword})
  
   if(user)
    res.json({ successful: true });
   else
    res.json({ successful: false });

 } catch (error) {
   console.error("Error adding user:", error);
   res.status(500).json({ successful: false, message: 'Internal Server Error' });
 }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Chat Bot
app.post("/sendToLLM", async (req, res) => {
  const { prompt } = req.body;

  if(!prompt){
    return res.status(400).json({ successful: false, message: 'Prompt is required' });
  }

  console.log(prompt)
})

