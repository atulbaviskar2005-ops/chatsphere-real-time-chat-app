import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload).then((res) => res.data),
  changePassword: (payload) => api.put('/auth/change-password', payload).then((res) => res.data),
  me: () => api.get('/users/me').then((res) => res.data),
};
