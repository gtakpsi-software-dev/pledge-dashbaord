import express from 'express';
import { body, validationResult } from 'express-validator';
import OneOnOne from '../models/OneOnOne.js';
import Brother from '../models/Brother.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all 1:1s for the authenticated pledge
router.get('/', authenticate, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { pledgeId: req.userId };
    
    if (type) {
      query.type = type;
    }

    const oneOnOnes = await OneOnOne.find(query)
      .populate('brotherId', 'name type position')
      .sort({ createdAt: -1 });

    res.json({ oneOnOnes });
  } catch (error) {
    console.error('Get 1:1s error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get 1:1 stats for the authenticated pledge
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await OneOnOne.aggregate([
      { $match: { pledgeId: req.userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          },
          thankYouSent: {
            $sum: { $cond: ['$thankYouSent', 1, 0] }
          }
        }
      }
    ]);

    const formattedStats = {
      networking: { total: 0, completed: 0, thankYouSent: 0 },
      brotherhood: { total: 0, completed: 0, thankYouSent: 0 },
      alumni: { total: 0, completed: 0, thankYouSent: 0 },
      industry: { total: 0, completed: 0, thankYouSent: 0 }
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = {
        total: stat.total,
        completed: stat.completed,
        thankYouSent: stat.thankYouSent
      };
    });

    res.json({ stats: formattedStats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new 1:1
router.post('/',
  authenticate,
  [
    body('type').isIn(['networking', 'brotherhood', 'alumni', 'industry'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        type,
        brotherId,
        contactName,
        meetingDate,
        emailSent,
        completed,
        thankYouSent,
        coffeeChat,
        notes
      } = req.body;

      // Validate brother ID for networking/brotherhood types
      if ((type === 'networking' || type === 'brotherhood') && brotherId) {
        const brother = await Brother.findById(brotherId);
        if (!brother || brother.type !== type) {
          return res.status(400).json({ message: 'Invalid brother for this type' });
        }
      }

      const oneOnOne = new OneOnOne({
        pledgeId: req.userId,
        type,
        brotherId: brotherId || null,
        contactName,
        meetingDate,
        emailSent: emailSent || false,
        completed: completed || false,
        thankYouSent: thankYouSent || false,
        coffeeChat: coffeeChat || false,
        notes
      });

      await oneOnOne.save();
      await oneOnOne.populate('brotherId', 'name type position');

      res.status(201).json({
        message: '1:1 created successfully',
        oneOnOne
      });
    } catch (error) {
      console.error('Create 1:1 error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update 1:1
router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      contactName,
      meetingDate,
      emailSent,
      completed,
      thankYouSent,
      coffeeChat,
      notes
    } = req.body;

    const oneOnOne = await OneOnOne.findOne({
      _id: req.params.id,
      pledgeId: req.userId
    });

    if (!oneOnOne) {
      return res.status(404).json({ message: '1:1 not found' });
    }

    // Update fields
    if (contactName !== undefined) oneOnOne.contactName = contactName;
    if (meetingDate !== undefined) oneOnOne.meetingDate = meetingDate;
    if (emailSent !== undefined) oneOnOne.emailSent = emailSent;
    if (completed !== undefined) oneOnOne.completed = completed;
    if (thankYouSent !== undefined) oneOnOne.thankYouSent = thankYouSent;
    if (coffeeChat !== undefined) oneOnOne.coffeeChat = coffeeChat;
    if (notes !== undefined) oneOnOne.notes = notes;

    await oneOnOne.save();
    await oneOnOne.populate('brotherId', 'name type position');

    res.json({
      message: '1:1 updated successfully',
      oneOnOne
    });
  } catch (error) {
    console.error('Update 1:1 error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete 1:1
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const oneOnOne = await OneOnOne.findOneAndDelete({
      _id: req.params.id,
      pledgeId: req.userId
    });

    if (!oneOnOne) {
      return res.status(404).json({ message: '1:1 not found' });
    }

    res.json({ message: '1:1 deleted successfully' });
  } catch (error) {
    console.error('Delete 1:1 error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

