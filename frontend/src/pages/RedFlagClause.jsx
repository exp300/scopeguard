import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getClause, getRelatedClauses, getCategoryName } from '../data/clauses';

export default function RedFlagClause() {
  const { slug } = useParams();
  const clause = getClause(slug);

  useEffect(() => {
    if (clause) {
      document.title = `${clause.title} — Freelance Contract Red Flag | ScopeGuard`;
      const meta = document.querySelector('meta[name="description"]') ||
        Object.assign(document.createElement('meta'), { name: 'description' });
      meta.content = clause.metaDescription;
      if (!meta.parentNode) document.head.appendChild(meta);
    }
    return () => { document.title = 'ScopeGuard — AI Scope Creep Detector for Freelancers'; };
  }, [clause]);

  if (!clause) return <Navigate to="/clause-library" replace />;

  const related = getRelatedClauses(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-gray-900">ScopeGuard</span>
          </Link>
          <Link to="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Sign up free →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>›</span>
          <Link to="/clause-library" className="hover:text-gray-700">Red Flag Clause Library</Link>
          <span>›</span>
          <span className="text-gray-400">{getCategoryName(clause.category)}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full mb-3">
            Red Flag · {getCategoryName(clause.category)}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {clause.title}
          </h1>
        </div>

        {/* Example */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            What it typically reads as
          </h2>
          <blockquote className="text-base text-gray-700 italic border-l-4 border-gray-300 pl-4 leading-relaxed">
            {clause.example}
          </blockquote>
        </section>

        {/* Why dangerous */}
        <section className="bg-white rounded-xl border border-red-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">!</span>
            Why this clause is dangerous
          </h2>
          <p className="text-gray-700 leading-relaxed">{clause.danger}</p>
        </section>

        {/* Real scenario */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-amber-800 mb-3">
            How this plays out in real life
          </h2>
          <p className="text-amber-900 leading-relaxed">{clause.realScenario}</p>
        </section>

        {/* Better language */}
        <section className="bg-white rounded-xl border border-green-200 p-6 mb-8">
          <h2 className="text-base font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Better language to negotiate for
          </h2>
          <p className="text-gray-700 leading-relaxed">{clause.fix}</p>
        </section>

        {/* CTA */}
        <div className="bg-brand-600 rounded-xl p-7 text-white text-center mb-10">
          <h2 className="font-bold text-lg mb-1">Already signed a contract with this clause?</h2>
          <p className="text-brand-100 text-sm mb-5 max-w-md mx-auto">
            Upload it to ScopeGuard. When a client sends a request, you'll know instantly whether
            it's in scope — with a ready-to-send reply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-brand-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Start free — no credit card
            </Link>
            <Link
              to="/contract-checker"
              className="inline-block bg-brand-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-400 transition-colors border border-brand-400"
            >
              Try the free scope checker →
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              More red flags to watch for
            </h2>
            <div className="space-y-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/red-flags/${r.slug}`}
                  className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{getCategoryName(r.category)}</p>
                    </div>
                    <span className="text-gray-300 text-sm">→</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/clause-library"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                See all {/* count from import */} red-flag clauses →
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-600">thescopeguard.com</Link>
        {' · '}
        <Link to="/clause-library" className="hover:text-gray-600">All Red Flag Clauses</Link>
        {' · '}
        <Link to="/contract-checker" className="hover:text-gray-600">Contract Scope Checker</Link>
        {' · '}
        <Link to="/change-order-generator" className="hover:text-gray-600">Change Order Generator</Link>
      </footer>
    </div>
  );
}
