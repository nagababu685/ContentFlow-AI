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
const { registerValidation, loginValidation, validate } = require('../middleware/validate');

// Public routes — with input validation
router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post('/logout', logoutUser);

// Protected routes — requires valid JWT cookie
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
