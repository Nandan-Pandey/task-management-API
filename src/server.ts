import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes'


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
// Set the port number for the server


app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err:any) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });