import axios from 'axios';
import { tokenStore } from '../auth/tokenStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5221/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (tokenStore.token) {
    config.headers.Authorization = `Bearer ${tokenStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry && tokenStore.token) {
      error.config._retry = true;
      await tokenStore.refresh();
      if (tokenStore.token) {
        error.config.headers.Authorization = `Bearer ${tokenStore.token}`;
        return api(error.config);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
