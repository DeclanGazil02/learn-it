import dotenv from 'dotenv';
import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import User from './Schemas/User.js'

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

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
  console.log("checking user email")
  // get search params 
  const email = req.query.email;

  const user = await User.findOne({email: email})

  if(user){
    res.json({ found: true }); // Example response
    console.log("Found")
  }
  else{
    res.json({ found: false }); // Example response
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
