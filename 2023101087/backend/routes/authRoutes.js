const express = require('express');
const { register, login, getProfile, validateToken, refreshToken, updateProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/validate-token', validateToken);
router.post('/refresh-token', refreshToken);

module.exports = router;
