import axios from 'axios';

/**
 * Centralized Axios instance
 * 
 * Why not use fetch()? Axios gives us:
 * - Automatic JSON parsing
 * - Request/response interceptors (global error handling)
 * - withCredentials for cookie-based auth
 * - Cleaner syntax for setting headers, params, etc.
 * 
 * Every API call in the app uses this instance,
 * so auth cookies are automatically sent with every request.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // If we get a 401, the user's session has expired
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
