import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BlogLangBar from '../components/BlogLangBar';
import { blogPostsEs } from '../data/blogPostsEs';
import { blogPostsPt } from '../data/blogPostsPt';

const LANG_CONFIG = {
  es: {
    posts: blogPostsEs,
    basePath: '/es/blog',
    backToHome: '← Volver a ScopeGuard',
    blogTitle: 'Blog de ScopeGuard',
    blogSub: 'Guías prácticas para freelancers sobre scope creep, contratos y cobrar de forma justa.',
    readArticle: 'Leer artículo →',
    ctaTitle: 'Deja de adivinar qué está en el alcance',
    ctaSub: 'Sube tu contrato y obtén un veredicto instantáneo de IA sobre cualquier solicitud del cliente.',
    ctaBtn: 'Prueba ScopeGuard gratis →',
    backToBlog: '← Todos los artículos',
    isClientInScope: '¿La solicitud de ese cliente está en el alcance?',
    ctaBody: 'Sube tu contrato a ScopeGuard y obtén un veredicto de IA en segundos — con la cláusula exacta citada y una respuesta lista para enviar.',
    moreArticles: 'Más artículos',
  },
  pt: {
    posts: blogPostsPt,
    basePath: '/pt/blog',
    backToHome: '← Voltar ao ScopeGuard',
    blogTitle: 'Blog do ScopeGuard',
    blogSub: 'Guias práticos para freelancers sobre scope creep, contratos e receber de forma justa.',
    readArticle: 'Ler artigo →',
    ctaTitle: 'Pare de adivinhar o que está no escopo',
    ctaSub: 'Envie seu contrato e obtenha um veredicto instantâneo de IA sobre qualquer solicitação do cliente.',
    ctaBtn: 'Teste o ScopeGuard de graça →',
    backToBlog: '← Todos os artigos',
    isClientInScope: 'Essa solicitação do cliente está no escopo?',
    ctaBody: 'Envie seu contrato ao ScopeGuard e obtenha um veredicto de IA em segundos — com a cláusula exata citada e uma resposta pronta para enviar.',
    moreArticles: 'Mais artigos',
  },
};

export function BlogLangList({ lang }) {
  const cfg = LANG_CONFIG[lang];
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('sg_lang', lang);
    }
  }, [lang, i18n]);

  if (!cfg) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              {cfg.backToHome}
            </Link>
            <BlogLangBar currentLang={lang} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{cfg.blogTitle}</h1>
          <p className="text-gray-500 mt-2">{cfg.blogSub}</p>
        </div>

        <div className="space-y-4">
          {cfg.posts.map(post => (
            <Link
              key={post.slug}
              to={`${cfg.basePath}/${post.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{post.metaDescription}</p>
              <span className="inline-block mt-3 text-sm text-brand-600 font-medium">{cfg.readArticle}</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-brand-50 border border-brand-100 rounded-xl px-8 py-6">
            <p className="text-sm font-medium text-brand-900 mb-1">{cfg.ctaTitle}</p>
            <p className="text-sm text-brand-700 mb-4">{cfg.ctaSub}</p>
            <Link to="/register" className="inline-block bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors">
              {cfg.ctaBtn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogLangPost({ lang }) {
  const { slug } = useParams();
  const cfg = LANG_CONFIG[lang];
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('sg_lang', lang);
    }
  }, [lang, i18n]);

  if (!cfg) return <Navigate to="/blog" replace />;

  const post = cfg.posts.find(p => p.slug === slug);
  if (!post) return <Navigate to={cfg.basePath} replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link to={cfg.basePath} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              {cfg.backToBlog}
            </Link>
            {/* Pass slug so switcher lands on the same article in other languages */}
            <BlogLangBar currentLang={lang} slug={slug} />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        <article
          className="bg-white rounded-xl border border-gray-200 px-8 py-10 prose prose-gray prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-3 prose-li:my-0.5 prose-blockquote:border-brand-300 prose-blockquote:bg-brand-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 bg-brand-50 border border-brand-100 rounded-xl px-8 py-6 text-center">
          <p className="text-sm font-semibold text-brand-900 mb-1">{cfg.isClientInScope}</p>
          <p className="text-sm text-brand-700 mb-4">{cfg.ctaBody}</p>
          <Link
            to="/register"
            className="inline-block bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            {cfg.ctaBtn}
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{cfg.moreArticles}</h3>
          <div className="space-y-3">
            {cfg.posts.filter(p => p.slug !== slug).slice(0, 3).map(related => (
              <Link
                key={related.slug}
                to={`${cfg.basePath}/${related.slug}`}
                className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-brand-300 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">{related.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{related.readingTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
