// client/src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get user from localStorage
const userFromStorage = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;

const initialState = {
  user: userFromStorage,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      // Remove from localStorage
      localStorage.removeItem('user');
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError
} = authSlice.actions;

export default authSlice.reducer;