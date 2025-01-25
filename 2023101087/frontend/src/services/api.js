import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/auth',  // Ensure this matches your backend URL
});

// Register user
export const registerUser = (userData) => API.post('/register', userData);

// Login user
export const loginUser = (userData) => API.post('/login', userData);

// Update user profile
export const updateUserProfile = (userData, token) => API.put('/profile', userData, {
  headers: { Authorization: `Bearer ${token}` },
});