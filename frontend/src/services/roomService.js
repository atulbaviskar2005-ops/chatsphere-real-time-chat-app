import api from './api';

export const roomService = {
  all: () => api.get('/rooms').then((res) => res.data),
  one: (id) => api.get(`/rooms/${id}`).then((res) => res.data),
  create: (payload) => api.post('/rooms', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/rooms/${id}`, payload).then((res) => res.data),
  join: (id) => api.post(`/rooms/${id}/join`).then((res) => res.data),
  leave: (id) => api.post(`/rooms/${id}/leave`).then((res) => res.data),
  addMember: (id, email) => api.post(`/rooms/${id}/add-member`, { email }).then((res) => res.data),
  removeMember: (id, email) => api.post(`/rooms/${id}/remove-member`, { email }).then((res) => res.data),
  search: (keyword) => api.get('/rooms/search', { params: { keyword } }).then((res) => res.data),
};
