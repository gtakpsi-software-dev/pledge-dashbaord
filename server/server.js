import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import brotherRoutes from './routes/brothers.js';
import oneOnOneRoutes from './routes/oneOnOnes.js';
import weeklyRequirementsRoutes from './routes/weeklyRequirements.js';
import paddleTaskRoutes from './routes/paddleTasks.js';
import todoRoutes from './routes/todos.js';
import feedbackRoutes from './routes/feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/brothers', brotherRoutes);
app.use('/api/one-on-ones', oneOnOneRoutes);
app.use('/api/weekly-requirements', weeklyRequirementsRoutes);
app.use('/api/paddle-tasks', paddleTaskRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/feedback', feedbackRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

export default app;

