import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60s — AI calls can take a moment
});

// Attach JWT to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and signal AuthContext via a custom event.
// Do NOT use window.location.href here — that causes a hard page reload which
// wipes React state, defeats the loading guard in ProtectedRoute, and makes
// the user bounce back to /login even after a successful login.
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn('[api] 401 received on', err.config?.url, '— clearing token, dispatching auth:logout');
      localStorage.removeItem('sg_token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(err);
  }
);

export default api;
