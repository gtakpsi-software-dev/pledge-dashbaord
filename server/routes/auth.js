import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * Normalise pledge class to "Fall 2025" / "Spring 2025" format.
 * Accepts any capitalisation. Returns null if format is invalid.
 */
const normalisePledgeClass = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  const match = trimmed.match(/^(spring|fall)\s+(\d{4})$/i);
  if (!match) return null;
  const semester = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  return `${semester} ${match[2]}`;
};

// ── Sign up ───────────────────────────────────────────────────────────────────
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('pledgeClass').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName } = req.body;

      // Validate & normalise pledge class format
      const pledgeClass = normalisePledgeClass(req.body.pledgeClass);
      if (!pledgeClass) {
        return res.status(400).json({
          message: 'Pledge class must be in "Fall YYYY" or "Spring YYYY" format (e.g., Fall 2025).'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new user — inactive until an admin approves
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        pledgeClass,
        role: 'pledge',
        isActive: false   // ← requires admin approval before login is allowed
      });

      await user.save();

      // Do NOT return a JWT — the account must be activated by an admin first.
      res.status(201).json({
        message: 'Account created! Your account is pending admin approval. You will be able to log in once an admin activates your account.',
        pending: true
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error during signup' });
    }
  }
);

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({
          message: 'Your account is pending admin approval. Please wait for an admin to activate your account.'
        });
      }

      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          pledgeClass: user.pledgeClass
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// ── Get current user ──────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        fullName: req.user.fullName,
        role: req.user.role,
        pledgeClass: req.user.pledgeClass
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Get all users (admin only) ────────────────────────────────────────────────
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const query = { isActive: true };
    if (role) query.role = role;

    const users = await User.find(query)
      .select('_id email firstName lastName fullName role pledgeClass')
      .sort({ pledgeClass: 1, lastName: 1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Get pending (inactive) accounts — admin only ──────────────────────────────
router.get('/users/pending', authenticate, requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ isActive: false, role: 'pledge' })
      .select('_id email firstName lastName pledgeClass createdAt')
      .sort({ createdAt: 1 });

    res.json({ users: pendingUsers });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Activate a pending account — admin only ───────────────────────────────────
router.put('/users/:id/activate', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('_id email firstName lastName pledgeClass role isActive');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `${user.firstName} ${user.lastName}'s account has been activated.`, user });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Deactivate an account — admin only ───────────────────────────────────────
router.put('/users/:id/deactivate', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('_id email firstName lastName pledgeClass role isActive');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `${user.firstName} ${user.lastName}'s account has been deactivated.`, user });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
