// src/services/api.js
import axios from 'axios';

// Uncomment for local deployment
// const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
// Uncomment for deployment on Render.com
const baseURL = process.env.REACT_APP_API_URL || 'https://research-summarizer-api.onrender.com/api';


const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors for authorization, error handling, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;