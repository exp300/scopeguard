import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VERDICT_STYLE = {
  IN_SCOPE:  { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500',  label: 'In Scope' },
  OUT_SCOPE: { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500',    label: 'Out of Scope' },
  AMBIGUOUS: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'Ambiguous' },
};

export default function ContractChecker() {
  const [contractText, setContractText] = useState('');
  const [clientRequest, setClientRequest] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    if (!contractText.trim()) { setError('Paste your contract text first'); return; }
    if (!clientRequest.trim()) { setError('Paste the client request first'); return; }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/free/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_text: contractText, client_request: clientRequest }),
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
    if (!result?.suggested_reply) return;
    navigator.clipboard.writeText(result.suggested_reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const verdict = result ? VERDICT_STYLE[result.verdict] ?? VERDICT_STYLE.AMBIGUOUS : null;

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
            Free Contract Scope Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste your freelance contract and a client's new request. AI tells you instantly
            whether it's in scope — and writes the reply for you.
          </p>
          <p className="text-sm text-gray-400 mt-2">1 free check per day · No signup required</p>
        </div>

        <form onSubmit={handleCheck} className="space-y-5">
          {/* Contract */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Your Contract
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Paste the full contract text — the Scope of Work section is the most important part.
            </p>
            <textarea
              value={contractText}
              onChange={e => setContractText(e.target.value)}
              placeholder={`Example:\n\n"Scope of Work: Designer will create 3 logo concepts and deliver final files in SVG, PNG, and PDF format. Up to 2 rounds of revisions are included. Any additional revisions or new design requests will be quoted separately."`}
              rows={8}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-300"
            />
            <p className="text-xs text-gray-400 mt-1.5 text-right">{contractText.length.toLocaleString()} chars</p>
          </div>

          {/* Client request */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Client's New Request
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Paste what your client just asked for — email, Slack message, whatever.
            </p>
            <textarea
              value={clientRequest}
              onChange={e => setClientRequest(e.target.value)}
              placeholder={`Example:\n\n"Hey, can you also create a version of the logo for social media headers? I need it in different sizes for Twitter, LinkedIn, and Instagram. Also, can you make it animated for email signatures?"`}
              rows={5}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-300"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
              {error.includes('sign up') && (
                <Link to="/register" className="font-semibold underline ml-1">Sign up free</Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !contractText.trim() || !clientRequest.trim()}
            className="w-full py-3 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Analyzing contract…
              </span>
            ) : 'Check Scope →'}
          </button>
        </form>

        {/* Result */}
        {result && verdict && (
          <div className="mt-8 space-y-4">
            {/* Verdict banner */}
            <div className={`rounded-xl border p-5 ${verdict.bg}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${verdict.bg} ${verdict.text}`}>
                  <span className={`w-2 h-2 rounded-full ${verdict.dot}`} />
                  {verdict.label}
                </span>
                <span className="text-sm text-gray-500">
                  {result.confidence}% confidence
                </span>
              </div>
              <p className={`text-sm font-medium ${verdict.text}`}>{result.reasoning}</p>
            </div>

            {/* Relevant clause */}
            {result.contract_clause && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Relevant Contract Clause</p>
                <blockquote className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-3">
                  "{result.contract_clause}"
                </blockquote>
              </div>
            )}

            {/* Suggested reply */}
            {result.suggested_reply && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Suggested Reply to Client</p>
                  <button
                    onClick={handleCopy}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.suggested_reply}
                </pre>
              </div>
            )}

            {/* CTA */}
            <div className="bg-brand-600 rounded-xl p-6 text-white text-center">
              <h2 className="font-bold text-lg mb-1">Protect every contract, not just this one</h2>
              <p className="text-brand-100 text-sm mb-4">
                Sign up free to save this result, upload all your contracts, and get unlimited scope checks.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-brand-600 font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Start free — no credit card
              </Link>
            </div>
          </div>
        )}

        {/* How it works */}
        {!result && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Paste your contract', desc: 'The scope of work section is enough. We read the whole thing.' },
              { icon: '💬', title: 'Paste the client request', desc: 'Email, Slack, DM — whatever format, paste it as-is.' },
              { icon: '⚡', title: 'Get the verdict in seconds', desc: 'IN SCOPE, OUT OF SCOPE, or AMBIGUOUS — with a ready-to-send reply.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-600">thescopeguard.com</Link>
        {' · '}
        <Link to="/clause-library" className="hover:text-gray-600">Red Flag Clause Library</Link>
        {' · '}
        <Link to="/change-order-generator" className="hover:text-gray-600">Change Order Generator</Link>
        {' · '}
        <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
      </footer>
    </div>
  );
}
