import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
];

export default function LanguageSwitcher({ light = false }) {
  const { i18n } = useTranslation();

  function handleChange(code) {
    i18n.changeLanguage(code);
    localStorage.setItem('sg_lang', code);
  }

  return (
    <div className="flex items-center gap-1">
      {LANGS.map((l, idx) => (
        <React.Fragment key={l.code}>
          {idx > 0 && (
            <span className={`text-xs ${light ? 'text-gray-600' : 'text-gray-300'}`}>|</span>
          )}
          <button
            onClick={() => handleChange(l.code)}
            className={`text-xs font-semibold transition-colors px-0.5 ${
              i18n.language === l.code
                ? light ? 'text-gray-900' : 'text-white'
                : light ? 'text-gray-400 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
