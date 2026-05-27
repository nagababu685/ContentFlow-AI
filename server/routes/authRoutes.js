const express = require('express');
const router = express.Router();

// Auth routes will be implemented in the next commit
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

module.exports = router;
