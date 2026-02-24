import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // You can replace the string below with process.env.MONGO_URI later
    const conn = await mongoose.connect('mongodb://localhost:27017/taskManager');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;