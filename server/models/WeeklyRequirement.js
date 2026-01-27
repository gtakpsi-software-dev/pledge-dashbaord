import mongoose from 'mongoose';

const weeklyRequirementSchema = new mongoose.Schema({
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  requirements: {
    networking: {
      type: Number,
      default: 0
    },
    brotherhood: {
      type: Number,
      default: 0
    },
    alumni: {
      type: Number,
      default: 0
    },
    industry: {
      type: Number,
      default: 0
    },
    paddleTasks: {
      type: Number,
      default: 0
    }
  },
  pledgeClass: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique week per pledge class
weeklyRequirementSchema.index({ weekStartDate: 1, pledgeClass: 1 }, { unique: true });

const WeeklyRequirement = mongoose.model('WeeklyRequirement', weeklyRequirementSchema);

export default WeeklyRequirement;

