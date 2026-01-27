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

export default Brother;

