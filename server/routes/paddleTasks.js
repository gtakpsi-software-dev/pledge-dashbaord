import express from 'express';
import { body, validationResult } from 'express-validator';
import PaddleTask from '../models/PaddleTask.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all paddle tasks for the authenticated pledge
router.get('/', authenticate, async (req, res) => {
  try {
    const paddleTasks = await PaddleTask.find({ pledgeId: req.userId })
      .sort({ weekDate: 1 });

    res.json({ paddleTasks });
  } catch (error) {
    console.error('Get paddle tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get or create paddle task for a specific week
router.get('/week/:date', authenticate, async (req, res) => {
  try {
    const weekDate = new Date(req.params.date);
    if (isNaN(weekDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use ISO 8601 (e.g. 2025-10-09).' });
    }

    let paddleTask = await PaddleTask.findOne({
      pledgeId: req.userId,
      weekDate
    });

    if (!paddleTask) {
      paddleTask = new PaddleTask({
        pledgeId: req.userId,
        weekDate
      });
      await paddleTask.save();
    }

    res.json({ paddleTask });
  } catch (error) {
    console.error('Get paddle task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update paddle task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      task1Completed,
      task2Completed,
      task1Notes,
      task2Notes,
      isNA
    } = req.body;

    const paddleTask = await PaddleTask.findOne({
      _id: req.params.id,
      pledgeId: req.userId
    });

    if (!paddleTask) {
      return res.status(404).json({ message: 'Paddle task not found' });
    }

    // Update fields
    if (task1Completed !== undefined) paddleTask.task1Completed = task1Completed;
    if (task2Completed !== undefined) paddleTask.task2Completed = task2Completed;
    if (task1Notes !== undefined) paddleTask.task1Notes = task1Notes;
    if (task2Notes !== undefined) paddleTask.task2Notes = task2Notes;
    if (isNA !== undefined) paddleTask.isNA = isNA;

    await paddleTask.save();

    res.json({
      message: 'Paddle task updated successfully',
      paddleTask
    });
  } catch (error) {
    console.error('Update paddle task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update paddle task for a specific week
router.post('/',
  authenticate,
  [body('weekDate').isISO8601()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        weekDate,
        task1Completed,
        task2Completed,
        task1Notes,
        task2Notes,
        isNA
      } = req.body;

      let paddleTask = await PaddleTask.findOne({
        pledgeId: req.userId,
        weekDate: new Date(weekDate)
      });

      if (paddleTask) {
        // Update existing
        if (task1Completed !== undefined) paddleTask.task1Completed = task1Completed;
        if (task2Completed !== undefined) paddleTask.task2Completed = task2Completed;
        if (task1Notes !== undefined) paddleTask.task1Notes = task1Notes;
        if (task2Notes !== undefined) paddleTask.task2Notes = task2Notes;
        if (isNA !== undefined) paddleTask.isNA = isNA;
        await paddleTask.save();
      } else {
        // Create new
        paddleTask = new PaddleTask({
          pledgeId: req.userId,
          weekDate: new Date(weekDate),
          task1Completed: task1Completed || false,
          task2Completed: task2Completed || false,
          task1Notes,
          task2Notes,
          isNA: isNA || false
        });
        await paddleTask.save();
      }

      res.status(201).json({
        message: 'Paddle task saved successfully',
        paddleTask
      });
    } catch (error) {
      console.error('Create/update paddle task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;

