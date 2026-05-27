const express = require('express');
const router = express.Router();
const { generatePostContent } = require('../controllers/generateController');
const { protect } = require('../middleware/authMiddleware');

// Protected — only logged-in users can generate content
router.post('/', protect, generatePostContent);

module.exports = router;
