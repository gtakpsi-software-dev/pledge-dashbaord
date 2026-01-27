import mongoose from 'mongoose';

const oneOnOneSchema = new mongoose.Schema({
  pledgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['networking', 'brotherhood', 'alumni', 'industry'],
    required: true
  },
  // For brother 1:1s
  brotherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brother'
  },
  // For alumni/industry 1:1s
  contactName: {
    type: String,
    trim: true
  },
  meetingDate: {
    type: Date
  },
  // Status tracking
  emailSent: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  thankYouSent: {
    type: Boolean,
    default: false
  },
  // Additional fields for alumni/industry
  coffeeChat: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
oneOnOneSchema.index({ pledgeId: 1, type: 1 });
oneOnOneSchema.index({ pledgeId: 1, brotherId: 1 });

const OneOnOne = mongoose.model('OneOnOne', oneOnOneSchema);

export default OneOnOne;

