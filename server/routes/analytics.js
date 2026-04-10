import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import OneOnOne from '../models/OneOnOne.js';
import PaddleTask from '../models/PaddleTask.js';

const router = express.Router();

// Get master roster analytics (admin only)
router.get('/roster', authenticate, requireAdmin, async (req, res) => {
  try {
    const { pledgeClass } = req.query;
    
    // 1. Get all active pledges
    const query = { role: 'pledge', isActive: true };
    if (pledgeClass) query.pledgeClass = pledgeClass;
    
    const pledges = await User.find(query).select('_id firstName lastName email pledgeClass');
    
    // 2. Resolve stats for every pledge
    const analyticsData = await Promise.all(pledges.map(async (pledge) => {
      const pledgeId = pledge._id;

      // Calculate 1:1 counts
      const oneOnOnes = await OneOnOne.find({ pledgeId, completed: true });
      const stats = {
        networking: oneOnOnes.filter(o => o.type === 'networking').length,
        brotherhood: oneOnOnes.filter(o => o.type === 'brotherhood').length,
        alumni: oneOnOnes.filter(o => o.type === 'alumni').length,
        industry: oneOnOnes.filter(o => o.type === 'industry').length
      };

      // Calculate Paddle Tasks
      const paddleTasks = await PaddleTask.countDocuments({ pledgeId, completed: true });

      return {
        _id: pledgeId,
        firstName: pledge.firstName,
        lastName: pledge.lastName,
        email: pledge.email,
        pledgeClass: pledge.pledgeClass,
        stats,
        paddleTasks
      };
    }));

    res.json({ analytics: analyticsData });
  } catch (error) {
    console.error('Analytics roster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
