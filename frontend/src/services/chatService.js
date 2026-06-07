import api from './api';

export const chatService = {
  users: () => api.get('/users').then((res) => res.data),
  searchUsers: (keyword) => api.get('/users/search', { params: { keyword } }).then((res) => res.data),
  privateHistory: (email) => api.get(`/messages/private/${encodeURIComponent(email)}`).then((res) => res.data),
  roomHistory: (roomId) => api.get(`/messages/room/${roomId}`).then((res) => res.data),
  sendPrivate: (email, payload) => api.post(`/messages/private/${encodeURIComponent(email)}`, payload).then((res) => res.data),
  sendRoom: (roomId, payload) => api.post(`/messages/room/${roomId}`, payload).then((res) => res.data),
  editMessage: (id, content) => api.put(`/messages/${id}`, { content }).then((res) => res.data),
  deleteMessage: (id) => api.delete(`/messages/${id}`).then((res) => res.data),
  upload: (file, meta = {}) => {
    const form = new FormData();
    form.append('file', file);
    Object.entries(meta).forEach(([key, value]) => value && form.append(key, value));
    return api.post('/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data);
  },
  notifications: () => api.get('/notifications').then((res) => res.data),
  markNotificationsRead: () => api.put('/notifications/read-all').then((res) => res.data),
};
