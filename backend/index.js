import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello world 123');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
