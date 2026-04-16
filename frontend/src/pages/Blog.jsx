import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogPosts } from '../data/blogPosts';

function BlogLangBar() {
  const LANGS = [
    { code: 'en', label: 'EN', path: '/blog' },
    { code: 'es', label: 'ES', path: '/es/blog' },
    { code: 'pt', label: 'PT', path: '/pt/blog' },
  ];
  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {LANGS.map((l, idx) => (
        <React.Fragment key={l.code}>
          {idx > 0 && <span className="text-gray-300">|</span>}
          <Link
            to={l.path}
            className={`px-0.5 transition-colors ${
              l.code === 'en'
                ? 'text-gray-900'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {l.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Blog() {
  const { i18n } = useTranslation();

  // Sync language to EN when visiting the English blog
  useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
      localStorage.setItem('sg_lang', 'en');
    }
  }, [i18n]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <span>←</span> Back to ScopeGuard
            </Link>
            <BlogLangBar />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ScopeGuard Blog</h1>
          <p className="text-gray-500 mt-2">Practical guides for freelancers on scope creep, contracts, and getting paid fairly.</p>
        </div>

        <div className="space-y-4">
          {blogPosts.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{post.metaDescription}</p>
              <span className="inline-block mt-3 text-sm text-brand-600 font-medium">Read article →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-brand-50 border border-brand-100 rounded-xl px-8 py-6">
            <p className="text-sm font-medium text-brand-900 mb-1">Stop guessing what's in scope</p>
            <p className="text-sm text-brand-700 mb-4">Upload your contract and get an instant AI verdict on any client request.</p>
            <Link to="/register" className="inline-block bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors">
              Try ScopeGuard free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
