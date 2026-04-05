import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // loading stays true until the stored-token check completes.
  // ProtectedRoute renders a spinner while loading === true, which prevents
  // the redirect-to-login race condition on first paint.
  const [loading, setLoading] = useState(true);

  // Log every time loading or user state transitions — makes the auth flow
  // visible in the browser console without needing React DevTools.
  useEffect(() => {
    console.log('[auth] loading:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('[auth] user:', user ? `${user.email} (id ${user.id}, plan ${user.plan})` : 'null');
  }, [user]);

  // On mount: validate stored token
  useEffect(() => {
    const token = localStorage.getItem('sg_token');
    console.log('[auth] App startup — token in localStorage:', token ? `present (${token.length} chars)` : 'none');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(res => {
        console.log('[auth] /auth/me succeeded — user:', res.data.user?.email);
        setUser(res.data.user);
      })
      .catch(err => {
        console.error('[auth] /auth/me failed — status:', err.response?.status, 'clearing token');
        localStorage.removeItem('sg_token');
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for auth:logout events dispatched by the api.js 401 interceptor.
  // This replaces the window.location.href hard-reload that was causing the
  // login redirect loop — state clears through React, ProtectedRoute handles
  // the navigate naturally without a page reload.
  useEffect(() => {
    function handleForceLogout() {
      console.warn('[auth] auth:logout event received — clearing user state');
      setUser(null);
      setLoading(false);
    }
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.token;

    // Save token FIRST — axios interceptor reads localStorage on every request,
    // so it must be present before setUser triggers any re-render that causes
    // authenticated API calls (e.g. Dashboard useEffect on mount).
    console.log('[auth] Login — saving token to localStorage at', Date.now(), 'userId:', res.data.user?.id);
    localStorage.setItem('sg_token', token);

    // Verify the token was actually written (localStorage can silently fail in
    // private browsing on some browsers when storage quota is exceeded).
    const saved = localStorage.getItem('sg_token');
    if (!saved) {
      console.error('[auth] Login — localStorage.setItem silently failed! Token not readable back.');
    } else {
      console.log('[auth] Login — token confirmed in localStorage, length:', saved.length);
    }

    console.log('[auth] Login — calling setUser at', Date.now());
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    const token = res.data.token;

    console.log('[auth] Register — saving token to localStorage at', Date.now(), 'userId:', res.data.user?.id);
    localStorage.setItem('sg_token', token);

    const saved = localStorage.getItem('sg_token');
    if (!saved) {
      console.error('[auth] Register — localStorage.setItem silently failed! Token not readable back.');
    } else {
      console.log('[auth] Register — token confirmed in localStorage, length:', saved.length);
    }

    console.log('[auth] Register — calling setUser at', Date.now());
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    console.log('[auth] Logout — clearing token and user');
    localStorage.removeItem('sg_token');
    setUser(null);
  }, []);

  // Refresh user data (e.g., after plan upgrade or hourly rate update)
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      console.log('[auth] refreshUser succeeded — user:', res.data.user?.email);
      setUser(res.data.user);
    } catch (err) {
      console.error('[auth] refreshUser failed — logging out, error:', err.response?.status);
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
