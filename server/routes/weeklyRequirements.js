import express from 'express';
import { body, validationResult } from 'express-validator';
import WeeklyRequirement from '../models/WeeklyRequirement.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all weekly requirements for a pledge class
router.get('/', authenticate, async (req, res) => {
  try {
    const pledgeClass = req.user.pledgeClass;
    
    const requirements = await WeeklyRequirement.find({
      pledgeClass,
      isActive: true
    }).sort({ weekStartDate: 1 });

    res.json({ requirements });
  } catch (error) {
    console.error('Get weekly requirements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current week's requirements
router.get('/current', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const pledgeClass = req.user.pledgeClass;

    const currentRequirement = await WeeklyRequirement.findOne({
      pledgeClass,
      isActive: true,
      weekStartDate: { $lte: now },
      weekEndDate: { $gte: now }
    });

    res.json({ requirement: currentRequirement });
  } catch (error) {
    console.error('Get current requirements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create weekly requirement (admin only)
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('weekStartDate').isISO8601(),
    body('weekEndDate').isISO8601(),
    body('pledgeClass').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        weekStartDate,
        weekEndDate,
        pledgeClass,
        requirements
      } = req.body;

      const weeklyRequirement = new WeeklyRequirement({
        weekStartDate,
        weekEndDate,
        pledgeClass,
        requirements: {
          networking: requirements?.networking || 0,
          brotherhood: requirements?.brotherhood || 0,
          alumni: requirements?.alumni || 0,
          industry: requirements?.industry || 0,
          paddleTasks: requirements?.paddleTasks || 0
        }
      });

      await weeklyRequirement.save();

      res.status(201).json({
        message: 'Weekly requirement created successfully',
        requirement: weeklyRequirement
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Weekly requirement already exists for this week' });
      }
      console.error('Create weekly requirement error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update weekly requirement (admin only)
router.put('/:id',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { requirements, isActive } = req.body;

      const weeklyRequirement = await WeeklyRequirement.findByIdAndUpdate(
        req.params.id,
        {
          requirements,
          isActive
        },
        { new: true, runValidators: true }
      );

      if (!weeklyRequirement) {
        return res.status(404).json({ message: 'Weekly requirement not found' });
      }

      res.json({
        message: 'Weekly requirement updated successfully',
        requirement: weeklyRequirement
      });
    } catch (error) {
      console.error('Update weekly requirement error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete weekly requirement (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const weeklyRequirement = await WeeklyRequirement.findByIdAndDelete(req.params.id);

    if (!weeklyRequirement) {
      return res.status(404).json({ message: 'Weekly requirement not found' });
    }

    res.json({ message: 'Weekly requirement deleted successfully' });
  } catch (error) {
    console.error('Delete weekly requirement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

