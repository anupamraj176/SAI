import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    
    if (!MONGODB_URL) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
