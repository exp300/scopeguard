import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ChangeOrderGenerator() {
  const [form, setForm] = useState({
    client_name: '',
    project_name: '',
    original_scope: '',
    new_request: '',
    hourly_rate: '',
    estimated_hours: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  const totalCost =
    form.hourly_rate && form.estimated_hours
      ? (parseFloat(form.hourly_rate) * parseFloat(form.estimated_hours)).toFixed(2)
      : null;

  async function handleGenerate(e) {
    e.preventDefault();
    if (!form.project_name.trim()) { setError('Project name is required'); return; }
    if (!form.new_request.trim()) { setError('New request description is required'); return; }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/free/change-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setResult(data.result);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result?.document) return;
    const text = result.subject ? `Subject: ${result.subject}\n\n${result.document}` : result.document;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setResult(null);
    setError('');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-gray-900">ScopeGuard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full">Free Tool</span>
            <Link to="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Sign up free →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Free Change Order Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Client wants extra work? Fill in the details and get a professional change order
            document you can send in seconds.
          </p>
          <p className="text-sm text-gray-400 mt-2">2 free change orders per day · No signup required</p>
        </div>

        {!result ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={form.client_name}
                    onChange={set('client_name')}
                    placeholder="Acme Corp"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.project_name}
                    onChange={set('project_name')}
                    placeholder="Website Redesign"
                    required
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Scope</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Original Scope (optional)</label>
                  <textarea
                    value={form.original_scope}
                    onChange={set('original_scope')}
                    placeholder="Design and develop 5 pages: Home, About, Services, Portfolio, Contact. Mobile-responsive. 2 rounds of revisions included."
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    New Request (what the client is asking for) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.new_request}
                    onChange={set('new_request')}
                    placeholder="Client wants to add a blog section with 3 post templates, an email newsletter signup integration, and a members-only area."
                    rows={4}
                    required
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Pricing (optional)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Hourly Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                    <input
                      type="number"
                      value={form.hourly_rate}
                      onChange={set('hourly_rate')}
                      placeholder="150"
                      min="0"
                      step="0.01"
                      className="w-full text-sm border border-gray-200 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={form.estimated_hours}
                    onChange={set('estimated_hours')}
                    placeholder="8"
                    min="0"
                    step="0.5"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Total Additional Cost</label>
                  <div className="w-full text-sm border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 font-semibold text-gray-700">
                    {totalCost ? `$${parseFloat(totalCost).toLocaleString()}` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.project_name.trim() || !form.new_request.trim()}
              className="w-full py-3 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generating change order…
                </span>
              ) : 'Generate Change Order →'}
            </button>

            {/* Why this matters */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Why send a formal change order?</p>
              <p className="text-sm text-amber-700">
                A verbal "yes" to extra work is how scope creep starts. A written change order creates a paper trail,
                protects you legally, and trains clients to respect your process. Clients who see you operate
                professionally are also more likely to pay promptly.
              </p>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Document */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Change Order</p>
                  {result.subject && (
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      Subject: {result.subject}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors px-4 py-1.5 bg-brand-50 rounded-lg"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-5">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.document}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Generate another
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 px-5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
              >
                {copied ? '✓ Copied to clipboard!' : 'Copy to clipboard'}
              </button>
            </div>

            {/* CTA */}
            <div className="bg-brand-600 rounded-xl p-6 text-white text-center">
              <h2 className="font-bold text-lg mb-1">Dealing with scope creep more often than you'd like?</h2>
              <p className="text-brand-100 text-sm mb-4">
                ScopeGuard checks every client request against your contract — before it becomes a problem.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-brand-600 font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Try ScopeGuard free →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-600">thescopeguard.com</Link>
        {' · '}
        <Link to="/contract-checker" className="hover:text-gray-600">Contract Scope Checker</Link>
        {' · '}
        <Link to="/clause-library" className="hover:text-gray-600">Red Flag Clause Library</Link>
        {' · '}
        <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
      </footer>
    </div>
  );
}
