const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Remove the profile route definition to avoid conflicts
// router.get('/profile', protect, (req, res) => {
//   res.json({ message: 'Welcome to your profile', user: req.user });
// });

module.exports = router;
