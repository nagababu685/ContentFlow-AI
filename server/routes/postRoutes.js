const express = require('express');
const router = express.Router();

// Post routes will be implemented in commit 4
router.get('/', (req, res) => {
  res.json({ message: 'Post routes working' });
});

module.exports = router;
