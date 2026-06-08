import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor – ajoute le token JWT au header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – gestion du 401 Unauthorized (session expirée)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const get = <T>(url: string) => api.get<T>(url).then(r => r.data);
export const post = <T>(url: string, data: any) => api.post<T>(url, data).then(r => r.data);
export const patch = <T>(url: string, data: any) => api.patch<T>(url, data).then(r => r.data);
export const del = <T>(url: string) => api.delete<T>(url).then(r => r.data);

export default api;

