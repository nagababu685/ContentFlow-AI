import api from './api';

/**
 * Post Service
 * 
 * CRUD operations for posts + AI content generation.
 * The generate function is the core feature — it sends a prompt
 * to our AI wrapper and returns generated social media content.
 */

export const generateContent = async (prompt, platform) => {
  const { data } = await api.post('/generate', { prompt, platform });
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post('/posts', postData);
  return data;
};

export const getPosts = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/posts${params ? `?${params}` : ''}`);
  return data;
};

export const getPost = async (id) => {
  const { data } = await api.get(`/posts/${id}`);
  return data;
};

export const updatePost = async (id, postData) => {
  const { data } = await api.put(`/posts/${id}`, postData);
  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/posts/stats');
  return data;
};
