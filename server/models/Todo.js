import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  pledgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'event', 'requirement', 'paddle', 'other'],
    default: 'general'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
todoSchema.index({ pledgeId: 1, completed: 1 });
todoSchema.index({ pledgeId: 1, dueDate: 1 });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;

