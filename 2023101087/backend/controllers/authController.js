const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  const { firstName, lastName, email, age, contactNumber, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    // Create new user instance
    user = new User({
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: hashed_password,
    });

    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login Request:', req.body); // Debugging statement

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging statement
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); // Debugging statement
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });

  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Validate Token
exports.validateToken = (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  console.log('Token to validate:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    console.error('Error validating token:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get User Profile (Protected Route)
exports.getProfile = async (req, res) => {
  console.log('\ninside getProfile\n');
  try {
    console.log('User ID:', req.user.user.id);
    const user = await User.findById(req.user.user.id).select('-password'); // Exclude password from response
    console.log('User:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Refresh Token
exports.refreshToken = (req, res) => {
  const { token } = req.body;
  console.log('Token to refresh:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ user: { id: decoded.user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: newToken });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
