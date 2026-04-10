import mongoose from 'mongoose';

const brotherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['networking', 'brotherhood'],
    required: true
  },
  position: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  familyLine: {
    type: String,
    trim: true
  },
  linkedInUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Brother = mongoose.model('Brother', brotherSchema);

// Prevent duplicate brothers of the same type
brotherSchema.index({ name: 1, type: 1 }, { unique: true });

export default Brother;

