import mongoose from 'mongoose';

const paddleTaskSchema = new mongoose.Schema({
  pledgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekDate: {
    type: Date,
    required: true
  },
  task1Completed: {
    type: Boolean,
    default: false
  },
  task2Completed: {
    type: Boolean,
    default: false
  },
  task1Notes: {
    type: String
  },
  task2Notes: {
    type: String
  },
  isNA: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure unique paddle task per pledge per week
paddleTaskSchema.index({ pledgeId: 1, weekDate: 1 }, { unique: true });

const PaddleTask = mongoose.model('PaddleTask', paddleTaskSchema);

export default PaddleTask;

