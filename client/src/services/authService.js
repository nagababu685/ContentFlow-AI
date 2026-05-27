import api from './api';

/**
 * Authentication Service
 * 
 * All auth-related API calls in one place.
 * Each function returns the response data, making it easy
 * to use in components: const { user } = await login(email, password)
 */

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/auth/profile', profileData);
  return data;
};
