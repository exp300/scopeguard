import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Register() {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError(t('register_password_error'));
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 to-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <span className="text-4xl">🛡️</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">ScopeGuard</h1>
          </Link>
          <p className="text-gray-500 text-sm mt-1">{t('register_subtitle')}</p>
          <div className="mt-3">
            <LanguageSwitcher light />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('register_heading')}</h2>
          <p className="text-sm text-gray-500 mb-5">{t('register_sub')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('register_name')}</label>
              <input
                type="text"
                className="input"
                placeholder="Alex Smith"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">{t('register_email')}</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">{t('register_password')}</label>
              <input
                type="password"
                className="input"
                placeholder={t('register_password_placeholder')}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? t('register_submitting') : t('register_submit')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t('register_have_account')}{' '}
          <Link to="/login" className="text-brand-600 hover:underline font-medium">
            {t('register_signin')}
          </Link>
        </p>
      </div>
    </div>
  );
}
