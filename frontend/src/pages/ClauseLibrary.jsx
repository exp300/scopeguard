import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clauses, clauseCategories } from '../data/clauses';
import { clausesEs, clauseCategoriesEs } from '../data/clausesEs';
import { clausesPt, clauseCategoriesPt } from '../data/clausesPt';

const I18N = {
  en: {
    h1: 'Freelance Contract Red Flag Clause Library',
    intro: (n) => `${n} clauses that freelancers commonly miss — what they say, why they're dangerous, and exactly how to negotiate better language. Click any clause for the full breakdown, real-world example, and replacement wording.`,
    docTitle: 'Freelance Contract Red Flag Clause Library | ScopeGuard',
    metaDesc: (n) => `${n} red-flag clauses freelancers commonly miss in contracts — what they say, why they're dangerous, and exactly how to negotiate better language.`,
    docTitleDefault: 'ScopeGuard — AI Scope Creep Detector for Freelancers',
    badge: 'Free Resource',
    signupCta: 'Sign up free →',
    readMore: 'Read full breakdown →',
    ctaHeading: 'Already have a contract with some of these?',
    ctaSub: "Upload it to ScopeGuard. When a client sends a new request, you'll know in seconds whether it's in scope — with a ready-to-send reply.",
    ctaPrimary: 'Start free — no credit card',
    ctaSecondary: 'Try the free scope checker →',
    homePath: '/',
    redFlagBasePath: '/red-flags',
    contractCheckerPath: '/contract-checker',
    changeOrderPath: '/change-order-generator',
    privacyPath: '/privacy',
    footerHome: 'thescopeguard.com',
    footerChecker: 'Contract Scope Checker',
    footerOrder: 'Change Order Generator',
    footerPrivacy: 'Privacy',
  },
  es: {
    h1: 'Biblioteca de Cláusulas Peligrosas en Contratos Freelance',
    intro: (n) => `${n} cláusulas que los freelancers suelen pasar por alto: qué dicen, por qué son peligrosas y cómo negociar un lenguaje mejor. Haz clic en cualquier cláusula para ver el análisis completo, un ejemplo real y la redacción alternativa.`,
    docTitle: 'Biblioteca de Cláusulas Peligrosas en Contratos Freelance | ScopeGuard',
    metaDesc: (n) => `${n} cláusulas peligrosas que los freelancers pasan por alto en sus contratos: qué dicen, por qué son peligrosas y cómo negociar un lenguaje mejor.`,
    docTitleDefault: 'ScopeGuard — Detector de Scope Creep con IA para Freelancers',
    badge: 'Recurso Gratuito',
    signupCta: 'Regístrate gratis →',
    readMore: 'Ver análisis completo →',
    ctaHeading: '¿Ya tienes un contrato con alguna de estas?',
    ctaSub: 'Súbelo a ScopeGuard. Cuando un cliente envíe una nueva solicitud, sabrás en segundos si está dentro del alcance, con una respuesta lista para enviar.',
    ctaPrimary: 'Empieza gratis — sin tarjeta',
    ctaSecondary: 'Prueba el verificador gratuito →',
    homePath: '/es',
    redFlagBasePath: '/es/red-flags',
    contractCheckerPath: '/contract-checker',
    changeOrderPath: '/change-order-generator',
    privacyPath: '/privacy',
    footerHome: 'thescopeguard.com',
    footerChecker: 'Verificador de Contratos',
    footerOrder: 'Generador de Órdenes de Cambio',
    footerPrivacy: 'Privacidad',
  },
  pt: {
    h1: 'Biblioteca de Cláusulas Perigosas em Contratos Freelancer',
    intro: (n) => `${n} cláusulas que freelancers costumam deixar passar: o que elas dizem, por que são perigosas e como negociar uma redação melhor. Clique em qualquer cláusula para ver a análise completa, exemplo real e redação alternativa.`,
    docTitle: 'Biblioteca de Cláusulas Perigosas em Contratos Freelancer | ScopeGuard',
    metaDesc: (n) => `${n} cláusulas perigosas que freelancers costumam deixar passar em contratos: o que dizem, por que são perigosas e como negociar uma redação melhor.`,
    docTitleDefault: 'ScopeGuard — Detector de Scope Creep com IA para Freelancers',
    badge: 'Recurso Grátis',
    signupCta: 'Cadastre-se grátis →',
    readMore: 'Ver análise completa →',
    ctaHeading: 'Já tem um contrato com alguma destas?',
    ctaSub: 'Suba para o ScopeGuard. Quando um cliente enviar uma nova solicitação, você saberá em segundos se está dentro do escopo, com uma resposta pronta para enviar.',
    ctaPrimary: 'Comece grátis — sem cartão',
    ctaSecondary: 'Teste o verificador grátis →',
    homePath: '/pt',
    redFlagBasePath: '/pt/red-flags',
    contractCheckerPath: '/contract-checker',
    changeOrderPath: '/change-order-generator',
    privacyPath: '/privacy',
    footerHome: 'thescopeguard.com',
    footerChecker: 'Verificador de Contratos',
    footerOrder: 'Gerador de Ordem de Mudança',
    footerPrivacy: 'Privacidade',
  },
};

const DATA_BY_LANG = {
  en: { clauses, categories: clauseCategories },
  es: { clauses: clausesEs, categories: clauseCategoriesEs },
  pt: { clauses: clausesPt, categories: clauseCategoriesPt },
};

export default function ClauseLibrary({ lang = 'en' }) {
  const t = I18N[lang] || I18N.en;
  const data = DATA_BY_LANG[lang] || DATA_BY_LANG.en;

  useEffect(() => {
    document.title = t.docTitle;
    const meta = document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement('meta'), { name: 'description' });
    meta.content = t.metaDesc(data.clauses.length);
    if (!meta.parentNode) document.head.appendChild(meta);
    return () => { document.title = t.docTitleDefault; };
  }, [t, data.clauses.length]);

  const byCategory = data.categories.map(cat => ({
    ...cat,
    items: data.clauses.filter(c => c.category === cat.id),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={t.homePath} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-gray-900">ScopeGuard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full">{t.badge}</span>
            <Link to="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              {t.signupCta}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {t.h1}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {t.intro(data.clauses.length)}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {data.categories.map(c => (
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
                    to={`${t.redFlagBasePath}/${clause.slug}`}
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
                      {t.readMore}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-brand-600 rounded-2xl p-8 text-white text-center">
          <h2 className="font-bold text-2xl mb-2">{t.ctaHeading}</h2>
          <p className="text-brand-100 mb-6 max-w-lg mx-auto">
            {t.ctaSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-brand-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              to={t.contractCheckerPath}
              className="inline-block bg-brand-500 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-400 transition-colors border border-brand-400"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to={t.homePath} className="hover:text-gray-600">{t.footerHome}</Link>
        {' · '}
        <Link to={t.contractCheckerPath} className="hover:text-gray-600">{t.footerChecker}</Link>
        {' · '}
        <Link to={t.changeOrderPath} className="hover:text-gray-600">{t.footerOrder}</Link>
        {' · '}
        <Link to={t.privacyPath} className="hover:text-gray-600">{t.footerPrivacy}</Link>
      </footer>
    </div>
  );
}
