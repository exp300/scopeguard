import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Billing from './pages/Billing';
import Landing from './pages/Landing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { BlogLangList, BlogLangPost } from './pages/BlogLang';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Landing page: guests see it, logged-in users go straight to dashboard
// Optionally sets language based on path prefix (/es or /pt)
function LandingRoute({ lang }) {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('sg_lang', lang);
    }
  }, [lang, i18n]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingRoute />} />

          {/* Localized landings — sets language automatically */}
          <Route path="/es" element={<LandingRoute lang="es" />} />
          <Route path="/pt" element={<LandingRoute lang="pt" />} />

          {/* Public auth */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />

          {/* English blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Spanish blog */}
          <Route path="/es/blog" element={<BlogLangList lang="es" />} />
          <Route path="/es/blog/:slug" element={<BlogLangPost lang="es" />} />

          {/* Portuguese blog */}
          <Route path="/pt/blog" element={<BlogLangList lang="pt" />} />
          <Route path="/pt/blog/:slug" element={<BlogLangPost lang="pt" />} />

          {/* Protected app */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="analyze/:contractId" element={<Analyze />} />
            <Route path="history" element={<History />} />
            <Route path="history/:contractId" element={<History />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
