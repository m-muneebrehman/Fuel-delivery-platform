// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};