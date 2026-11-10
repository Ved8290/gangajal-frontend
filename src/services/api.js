import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', withCredentials: true, timeout: 20000 });
api.interceptors.response.use(
  (r) => r,
  (e) => {
    e.userMessage = e.response?.data?.message || e.message;
    return Promise.reject(e);
  }
);
export const get = (url, params) => api.get(url, { params }).then((r) => r.data);
export const post = (url, data) => api.post(url, data).then((r) => r.data);
export const put = (url, data) => api.put(url, data).then((r) => r.data);
export const del = (url) => api.delete(url).then((r) => r.data);
export default api;
