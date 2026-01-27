import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  pledgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestone: {
    type: String,
    required: true,
    enum: [
      'week1-1on1',
      'week2-1on1',
      'week3-1on1',
      'week4-1on1',
      'week5-1on1',
      'week6-1on1',
      'week7-1on1',
      'week8-1on1',
      'week9-1on1',
      'week10-1on1',
      'week11-1on1',
      'week12-1on1',
      'first-vote',
      'dei-presentations',
      'midterm',
      'personal-brand-presentation',
      'court-of-honor-presentation'
    ]
  },
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  givenByName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Index for faster queries
feedbackSchema.index({ pledgeId: 1, milestone: 1 });
feedbackSchema.index({ pledgeId: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

