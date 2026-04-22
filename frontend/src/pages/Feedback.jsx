import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Feedback() {
  const [type, setType] = useState('feature');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (message.trim().length < 5) { setError('Please add a bit more detail.'); return; }
    setStatus('sending');
    try {
      await api.post('/feedback', { type, email, message });
      setStatus('sent');
      setMessage('');
    } catch (err) {
      setStatus('idle');
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <span>←</span> Back to ScopeGuard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Request a feature</h1>
        <p className="text-gray-600 mt-2">
          Tell us what would make ScopeGuard more useful for you. Feature request, bug, or anything else — we read every message.
        </p>

        {status === 'sent' ? (
          <div className="mt-8 bg-white border border-green-200 rounded-xl p-8 text-center">
            <div className="text-2xl mb-2">✓</div>
            <h2 className="text-lg font-semibold text-gray-900">Got it, thanks.</h2>
            <p className="text-gray-600 mt-1">We'll take a look and get back to you if we need more details.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-brand-600 hover:underline"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 bg-white rounded-xl border border-gray-200 p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What is it?</label>
              <div className="flex gap-2">
                {[
                  { v: 'feature', l: '💡 Feature' },
                  { v: 'bug', l: '🐛 Bug' },
                  { v: 'other', l: '💬 Other' },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setType(o.v)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      type === o.v
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-gray-400 font-normal">(optional — if you want a reply)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={7}
                maxLength={4000}
                placeholder="What would you like to see?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                required
              />
              <div className="text-xs text-gray-400 mt-1 text-right">{message.length} / 4000</div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition"
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
