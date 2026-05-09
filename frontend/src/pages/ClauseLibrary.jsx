import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clauses, clauseCategories } from '../data/clauses';

export default function ClauseLibrary() {
  useEffect(() => {
    document.title = 'Freelance Contract Red Flag Clause Library | ScopeGuard';
    const meta = document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement('meta'), { name: 'description' });
    meta.content =
      `${clauses.length} red-flag clauses freelancers commonly miss in contracts — what they say, why they're dangerous, and exactly how to negotiate better language.`;
    if (!meta.parentNode) document.head.appendChild(meta);
    return () => { document.title = 'ScopeGuard — AI Scope Creep Detector for Freelancers'; };
  }, []);

  const byCategory = clauseCategories.map(cat => ({
    ...cat,
    items: clauses.filter(c => c.category === cat.id),
  }));

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
            <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full">Free Resource</span>
            <Link to="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Sign up free →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Freelance Contract Red Flag Clause Library
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {clauses.length} clauses that freelancers commonly miss — what they say, why they're dangerous,
            and exactly how to negotiate better language. Click any clause for the full breakdown,
            real-world example, and replacement wording.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {clauseCategories.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  const el = document.getElementById(c.id);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories with cards */}
        <div className="space-y-12">
          {byCategory.map(cat => (
            <section key={cat.id} id={cat.id}>
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-500 rounded-full inline-block" />
                {cat.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map(clause => (
                  <Link
                    key={clause.slug}
                    to={`/red-flags/${clause.slug}`}
                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">!</span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                        {clause.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 ml-9">
                      {clause.example.replace(/^"|"$/g, '')}
                    </p>
                    <p className="text-xs font-medium text-brand-600 mt-3 ml-9 group-hover:underline">
                      Read full breakdown →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-brand-600 rounded-2xl p-8 text-white text-center">
          <h2 className="font-bold text-2xl mb-2">Already have a contract with some of these?</h2>
          <p className="text-brand-100 mb-6 max-w-lg mx-auto">
            Upload it to ScopeGuard. When a client sends a new request, you'll know in seconds
            whether it's in scope — with a ready-to-send reply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-brand-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Start free — no credit card
            </Link>
            <Link
              to="/contract-checker"
              className="inline-block bg-brand-500 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-400 transition-colors border border-brand-400"
            >
              Try the free scope checker →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-600">thescopeguard.com</Link>
        {' · '}
        <Link to="/contract-checker" className="hover:text-gray-600">Contract Scope Checker</Link>
        {' · '}
        <Link to="/change-order-generator" className="hover:text-gray-600">Change Order Generator</Link>
        {' · '}
        <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
      </footer>
    </div>
  );
}
