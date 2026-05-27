const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getStats,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { postValidation, validate } = require('../middleware/validate');

// All post routes are protected — user must be logged in
router.use(protect);

// Stats route MUST come before /:id route
// Otherwise Express would treat "stats" as an :id parameter
router.get('/stats', getStats);

router.route('/')
  .get(getPosts)
  .post(postValidation, validate, createPost);

router.route('/:id')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
