import express from 'express';
import { body, validationResult } from 'express-validator';
import Brother from '../models/Brother.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all brothers
router.get('/', authenticate, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    
    if (type && ['networking', 'brotherhood'].includes(type)) {
      query.type = type;
    }

    const brothers = await Brother.find(query).sort({ name: 1 });
    res.json({ brothers });
  } catch (error) {
    console.error('Get brothers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new brother (admin only)
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('type').isIn(['networking', 'brotherhood'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, type, position, industry, major, familyLine, linkedInUrl } = req.body;

      const brother = new Brother({
        name,
        type,
        position,
        industry,
        major,
        familyLine,
        linkedInUrl,
        addedBy: req.userId
      });

      await brother.save();

      res.status(201).json({
        message: 'Brother added successfully',
        brother
      });
    } catch (error) {
      console.error('Add brother error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update brother (admin only)
router.put('/:id',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { name, type, position, industry, major, familyLine, linkedInUrl, isActive } = req.body;
      
      const brother = await Brother.findByIdAndUpdate(
        req.params.id,
        { name, type, position, industry, major, familyLine, linkedInUrl, isActive },
        { new: true, runValidators: true }
      );

      if (!brother) {
        return res.status(404).json({ message: 'Brother not found' });
      }

      res.json({
        message: 'Brother updated successfully',
        brother
      });
    } catch (error) {
      console.error('Update brother error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete brother (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const brother = await Brother.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!brother) {
      return res.status(404).json({ message: 'Brother not found' });
    }

    res.json({ message: 'Brother deactivated successfully' });
  } catch (error) {
    console.error('Delete brother error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

