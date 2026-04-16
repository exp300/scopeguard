import React from 'react';
import { Link } from 'react-router-dom';

const LANGS = [
  { code: 'en', label: 'EN', base: '/blog' },
  { code: 'es', label: 'ES', base: '/es/blog' },
  { code: 'pt', label: 'PT', base: '/pt/blog' },
];

/**
 * Language switcher for blog pages.
 * - currentLang: 'en' | 'es' | 'pt'
 * - slug: when provided (post page), links to the same slug in each language.
 *         when omitted (list page), links to each language's blog root.
 */
export default function BlogLangBar({ currentLang, slug }) {
  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      {LANGS.map((l, idx) => {
        const href = slug ? `${l.base}/${slug}` : l.base;
        return (
          <React.Fragment key={l.code}>
            {idx > 0 && <span className="text-gray-300">|</span>}
            <Link
              to={href}
              className={`px-0.5 transition-colors ${
                currentLang === l.code
                  ? 'text-gray-900 pointer-events-none'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {l.label}
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
}
