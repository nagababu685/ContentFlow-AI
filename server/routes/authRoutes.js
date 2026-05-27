const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes — no authentication required
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes — requires valid JWT cookie
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
