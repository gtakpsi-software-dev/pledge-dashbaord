import express from 'express';
import { body, validationResult } from 'express-validator';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all feedback for the authenticated pledge
router.get('/', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.find({ pledgeId: req.userId })
      .populate('givenBy', 'firstName lastName')
      .sort({ milestone: 1, createdAt: -1 });

    res.json({ feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback for a specific milestone
router.get('/milestone/:milestone', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      pledgeId: req.userId,
      milestone: req.params.milestone
    })
      .populate('givenBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ feedback });
  } catch (error) {
    console.error('Get milestone feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all pledges (admin only) - for admin interface
router.get('/pledges', authenticate, requireAdmin, async (req, res) => {
  try {
    const pledges = await User.find({ 
      role: 'pledge', 
      isActive: true 
    }).select('firstName lastName email pledgeClass').sort({ lastName: 1, firstName: 1 });

    res.json({ pledges });
  } catch (error) {
    console.error('Get pledges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all feedback for all pledges (admin only)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { pledgeId, milestone, pledgeClass } = req.query;
    
    let query = {};
    
    if (pledgeId) {
      query.pledgeId = pledgeId;
    } else if (pledgeClass) {
      const pledges = await User.find({ 
        role: 'pledge', 
        pledgeClass, 
        isActive: true 
      }).select('_id');
      query.pledgeId = { $in: pledges.map(p => p._id) };
    }
    
    if (milestone) {
      query.milestone = milestone;
    }

    const feedback = await Feedback.find(query)
      .populate('pledgeId', 'firstName lastName email pledgeClass')
      .populate('givenBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ feedback });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new feedback (admin only)
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('pledgeId').notEmpty(),
    body('milestone').notEmpty(),
    body('feedback').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { pledgeId, milestone, feedback, rating } = req.body;

      // Verify pledge exists
      const pledge = await User.findOne({ _id: pledgeId, role: 'pledge' });
      if (!pledge) {
        return res.status(404).json({ message: 'Pledge not found' });
      }

      const feedbackDoc = new Feedback({
        pledgeId,
        milestone,
        feedback,
        rating,
        givenBy: req.userId,
        givenByName: `${req.user.firstName} ${req.user.lastName}`
      });

      await feedbackDoc.save();
      await feedbackDoc.populate('pledgeId', 'firstName lastName email');
      await feedbackDoc.populate('givenBy', 'firstName lastName');

      res.status(201).json({
        message: 'Feedback created successfully',
        feedback: feedbackDoc
      });
    } catch (error) {
      console.error('Create feedback error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update feedback (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { feedback, rating } = req.body;

    const feedbackDoc = await Feedback.findById(req.params.id);
    
    if (!feedbackDoc) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback !== undefined) feedbackDoc.feedback = feedback;
    if (rating !== undefined) feedbackDoc.rating = rating;

    await feedbackDoc.save();
    await feedbackDoc.populate('pledgeId', 'firstName lastName email');
    await feedbackDoc.populate('givenBy', 'firstName lastName');

    res.json({
      message: 'Feedback updated successfully',
      feedback: feedbackDoc
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

