import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getClause, getRelatedClauses, getCategoryName } from '../data/clauses';
import { getClauseEs, getRelatedClausesEs, getCategoryNameEs } from '../data/clausesEs';
import { getClausePt, getRelatedClausesPt, getCategoryNamePt } from '../data/clausesPt';

const I18N = {
  en: {
    homeLabel: 'Home',
    libraryLabel: 'Red Flag Clause Library',
    libraryPath: '/clause-library',
    redFlagBadge: 'Red Flag',
    typicalReadsAs: 'What it typically reads as',
    whyDangerous: 'Why this clause is dangerous',
    realLifeHeading: 'How this plays out in real life',
    betterLanguage: 'Better language to negotiate for',
    ctaHeading: 'Already signed a contract with this clause?',
    ctaSub: "Upload it to ScopeGuard. When a client sends a request, you'll know instantly whether it's in scope — with a ready-to-send reply.",
    ctaPrimary: 'Start free — no credit card',
    ctaSecondary: 'Try the free scope checker →',
    relatedHeading: 'More red flags to watch for',
    seeAll: 'See all red-flag clauses →',
    signupCta: 'Sign up free →',
    redFlagBasePath: '/red-flags',
    titleSuffix: 'Freelance Contract Red Flag | ScopeGuard',
    homePath: '/',
    docTitleDefault: 'ScopeGuard — AI Scope Creep Detector for Freelancers',
    redirect: '/clause-library',
    footerHome: 'thescopeguard.com',
    footerAll: 'All Red Flag Clauses',
    footerChecker: 'Contract Scope Checker',
    footerOrder: 'Change Order Generator',
    contractCheckerPath: '/contract-checker',
    changeOrderPath: '/change-order-generator',
  },
  es: {
    homeLabel: 'Inicio',
    libraryLabel: 'Biblioteca de Cláusulas Peligrosas',
    libraryPath: '/es/clause-library',
    redFlagBadge: 'Bandera Roja',
    typicalReadsAs: 'Cómo suele aparecer',
    whyDangerous: 'Por qué esta cláusula es peligrosa',
    realLifeHeading: 'Cómo se ve esto en la vida real',
    betterLanguage: 'Mejor lenguaje para negociar',
    ctaHeading: '¿Ya firmaste un contrato con esta cláusula?',
    ctaSub: 'Súbelo a ScopeGuard. Cuando un cliente te envíe una solicitud, sabrás al instante si está dentro del alcance, con una respuesta lista para enviar.',
    ctaPrimary: 'Empieza gratis — sin tarjeta',
    ctaSecondary: 'Prueba el verificador gratuito →',
    relatedHeading: 'Más banderas rojas a vigilar',
    seeAll: 'Ver todas las cláusulas peligrosas →',
    signupCta: 'Regístrate gratis →',
    redFlagBasePath: '/es/red-flags',
    titleSuffix: 'Cláusula de Riesgo en Contratos Freelance | ScopeGuard',
    homePath: '/es',
    docTitleDefault: 'ScopeGuard — Detector de Scope Creep con IA para Freelancers',
    redirect: '/es/clause-library',
    footerHome: 'thescopeguard.com',
    footerAll: 'Todas las Cláusulas Peligrosas',
    footerChecker: 'Verificador de Contratos',
    footerOrder: 'Generador de Órdenes de Cambio',
    contractCheckerPath: '/contract-checker',
    changeOrderPath: '/change-order-generator',
  },
  pt: {
    homeLabel: 'Início',
    libraryLabel: 'Biblioteca de Cláusulas Perigosas',
    libraryPath: '/pt/clause-library',
    redFlagBadge: 'Bandeira Vermelha',
    typicalReadsAs: 'Como costuma aparecer',
    whyDangerous: 'Por que esta cláusula é perigosa',
    realLifeHeading: 'Como isso se desenrola na vida real',
    betterLanguage: 'Linguagem melhor para negociar',
    ctaHeading: 'Já assinou um contrato com esta cláusula?',
    ctaSub: 'Suba para o ScopeGuard. Quando um cliente enviar uma solicitação, você saberá instantaneamente se está dentro do escopo, com uma resposta pronta para enviar.',
    ctaPrimary: 'Comece grátis — sem cartão',
    ctaSecondary: 'Teste o verificador grátis →',
    relatedHeading: 'Mais bandeiras vermelhas para ficar de olho',
    seeAll: 'Ver todas as cláusulas perigosas →',
    signupCta: 'Cadastre-se grátis →',
    redFlagBasePath: '/pt/red-flags',
    titleSuffix: 'Cláusula de Risco em Contratos Freelancer | ScopeGuard',
    homePath: '/pt',
    docTitleDefault: 'ScopeGuard — Detector de Scope Creep com IA para Freelancers',
    redirect: '/pt/clause-library',
    footerHome: 'thescopeguard.com',
    footerAll: 'Todas as Cláusulas Perigosas',
    footerChecker: 'Verificador de Contratos',
    footerOrder: 'Gerador de Ordem de Mudança',
    contractCheckerPath: '/contract-checker',
    changeOrderPath: '/change-order-generator',
  },
};

const DATA_BY_LANG = {
  en: { get: getClause, related: getRelatedClauses, catName: getCategoryName },
  es: { get: getClauseEs, related: getRelatedClausesEs, catName: getCategoryNameEs },
  pt: { get: getClausePt, related: getRelatedClausesPt, catName: getCategoryNamePt },
};

export default function RedFlagClause({ lang = 'en' }) {
  const { slug } = useParams();
  const t = I18N[lang] || I18N.en;
  const data = DATA_BY_LANG[lang] || DATA_BY_LANG.en;
  const clause = data.get(slug);

  useEffect(() => {
    if (clause) {
      document.title = `${clause.title} — ${t.titleSuffix}`;
      const meta = document.querySelector('meta[name="description"]') ||
        Object.assign(document.createElement('meta'), { name: 'description' });
      meta.content = clause.metaDescription;
      if (!meta.parentNode) document.head.appendChild(meta);
    }
    return () => { document.title = t.docTitleDefault; };
  }, [clause, t]);

  if (!clause) return <Navigate to={t.redirect} replace />;

  const related = data.related(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={t.homePath} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-gray-900">ScopeGuard</span>
          </Link>
          <Link to="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            {t.signupCta}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link to={t.homePath} className="hover:text-gray-700">{t.homeLabel}</Link>
          <span>›</span>
          <Link to={t.libraryPath} className="hover:text-gray-700">{t.libraryLabel}</Link>
          <span>›</span>
          <span className="text-gray-400">{data.catName(clause.category)}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full mb-3">
            {t.redFlagBadge} · {data.catName(clause.category)}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {clause.title}
          </h1>
        </div>

        {/* Example */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {t.typicalReadsAs}
          </h2>
          <blockquote className="text-base text-gray-700 italic border-l-4 border-gray-300 pl-4 leading-relaxed">
            {clause.example}
          </blockquote>
        </section>

        {/* Why dangerous */}
        <section className="bg-white rounded-xl border border-red-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">!</span>
            {t.whyDangerous}
          </h2>
          <p className="text-gray-700 leading-relaxed">{clause.danger}</p>
        </section>

        {/* Real scenario */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-amber-800 mb-3">
            {t.realLifeHeading}
          </h2>
          <p className="text-amber-900 leading-relaxed">{clause.realScenario}</p>
        </section>

        {/* Better language */}
        <section className="bg-white rounded-xl border border-green-200 p-6 mb-8">
          <h2 className="text-base font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            {t.betterLanguage}
          </h2>
          <p className="text-gray-700 leading-relaxed">{clause.fix}</p>
        </section>

        {/* CTA */}
        <div className="bg-brand-600 rounded-xl p-7 text-white text-center mb-10">
          <h2 className="font-bold text-lg mb-1">{t.ctaHeading}</h2>
          <p className="text-brand-100 text-sm mb-5 max-w-md mx-auto">
            {t.ctaSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-brand-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              to={t.contractCheckerPath}
              className="inline-block bg-brand-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-400 transition-colors border border-brand-400"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              {t.relatedHeading}
            </h2>
            <div className="space-y-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`${t.redFlagBasePath}/${r.slug}`}
                  className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{data.catName(r.category)}</p>
                    </div>
                    <span className="text-gray-300 text-sm">→</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to={t.libraryPath}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {t.seeAll}
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to={t.homePath} className="hover:text-gray-600">{t.footerHome}</Link>
        {' · '}
        <Link to={t.libraryPath} className="hover:text-gray-600">{t.footerAll}</Link>
        {' · '}
        <Link to={t.contractCheckerPath} className="hover:text-gray-600">{t.footerChecker}</Link>
        {' · '}
        <Link to={t.changeOrderPath} className="hover:text-gray-600">{t.footerOrder}</Link>
      </footer>
    </div>
  );
}
