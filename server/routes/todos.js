import express from 'express';
import { body, validationResult } from 'express-validator';
import Todo from '../models/Todo.js';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all todos for the authenticated pledge
router.get('/', authenticate, async (req, res) => {
  try {
    const query = { pledgeId: req.userId };
    
    // Optional filters
    if (req.query.completed !== undefined) {
      query.completed = req.query.completed === 'true';
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    const todos = await Todo.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ completed: 1, dueDate: 1, createdAt: -1 });

    res.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all todos for all pledges (admin only)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { pledgeClass } = req.query;
    
    let userQuery = { role: 'pledge', isActive: true };
    if (pledgeClass) {
      userQuery.pledgeClass = pledgeClass;
    }

    const pledges = await User.find(userQuery).select('_id');
    const pledgeIds = pledges.map(p => p._id);

    const todos = await Todo.find({ pledgeId: { $in: pledgeIds } })
      .populate('pledgeId', 'firstName lastName email pledgeClass')
      .populate('createdBy', 'firstName lastName')
      .sort({ completed: 1, dueDate: 1, createdAt: -1 });

    res.json({ todos });
  } catch (error) {
    console.error('Get all todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new todo (admin only)
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('pledgeId').notEmpty(),
    body('title').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { pledgeId, title, description, dueDate, priority, category } = req.body;

      // Verify pledge exists
      const pledge = await User.findOne({ _id: pledgeId, role: 'pledge' });
      if (!pledge) {
        return res.status(404).json({ message: 'Pledge not found' });
      }

      const todo = new Todo({
        pledgeId,
        title,
        description,
        dueDate,
        priority: priority || 'medium',
        category: category || 'general',
        createdBy: req.userId
      });

      await todo.save();
      await todo.populate('pledgeId', 'firstName lastName email');
      await todo.populate('createdBy', 'firstName lastName');

      res.status(201).json({
        message: 'Todo created successfully',
        todo
      });
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create todo for multiple pledges (admin only)
router.post('/bulk',
  authenticate,
  requireAdmin,
  [body('title').trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { pledgeIds, pledgeClass, title, description, dueDate, priority, category } = req.body;

      let targetPledgeIds = pledgeIds;

      // If pledgeClass is provided instead of specific IDs
      if (!pledgeIds && pledgeClass) {
        const pledges = await User.find({ 
          role: 'pledge', 
          pledgeClass, 
          isActive: true 
        }).select('_id');
        targetPledgeIds = pledges.map(p => p._id.toString());
      }

      if (!targetPledgeIds || targetPledgeIds.length === 0) {
        return res.status(400).json({ message: 'No pledges specified' });
      }

      const todos = await Promise.all(
        targetPledgeIds.map(pledgeId => 
          Todo.create({
            pledgeId,
            title,
            description,
            dueDate,
            priority: priority || 'medium',
            category: category || 'general',
            createdBy: req.userId
          })
        )
      );

      res.status(201).json({
        message: `Todo created for ${todos.length} pledge(s)`,
        count: todos.length
      });
    } catch (error) {
      console.error('Bulk create todo error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update todo
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, completed } = req.body;

    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Pledges can only update their own todos' completion status
    if (req.user.role === 'pledge') {
      if (todo.pledgeId.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      // Pledges can only toggle completion
      if (completed !== undefined) {
        todo.completed = completed;
        todo.completedAt = completed ? new Date() : null;
      }
    } else if (req.user.role === 'admin') {
      // Admins can update everything
      if (title !== undefined) todo.title = title;
      if (description !== undefined) todo.description = description;
      if (dueDate !== undefined) todo.dueDate = dueDate;
      if (priority !== undefined) todo.priority = priority;
      if (category !== undefined) todo.category = category;
      if (completed !== undefined) {
        todo.completed = completed;
        todo.completedAt = completed ? new Date() : null;
      }
    }

    await todo.save();
    await todo.populate('pledgeId', 'firstName lastName email');
    await todo.populate('createdBy', 'firstName lastName');

    res.json({
      message: 'Todo updated successfully',
      todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete todo (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todo stats for pledge
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { pledgeId: req.userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } }
        }
      }
    ]);

    const result = stats[0] || { total: 0, completed: 0, pending: 0 };
    
    res.json({ stats: result });
  } catch (error) {
    console.error('Get todo stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

