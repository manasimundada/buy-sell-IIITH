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

// Get User Profile (Protected Route)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};
