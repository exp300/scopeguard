import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Meta description via useEffect would need react-helmet; for now it's in the HTML */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
            <span>←</span> All articles
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Article */}
        <article
          className="bg-white rounded-xl border border-gray-200 px-8 py-10 prose prose-gray prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-3 prose-li:my-0.5 prose-blockquote:border-brand-300 prose-blockquote:bg-brand-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-10 bg-brand-50 border border-brand-100 rounded-xl px-8 py-6 text-center">
          <p className="text-sm font-semibold text-brand-900 mb-1">Is that client request in scope?</p>
          <p className="text-sm text-brand-700 mb-4">
            Upload your contract to ScopeGuard and get an AI verdict in seconds — with the exact clause cited and a reply you can send immediately.
          </p>
          <Link
            to="/register"
            className="inline-block bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Try ScopeGuard free →
          </Link>
        </div>

        {/* Related posts */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">More articles</h3>
          <div className="space-y-3">
            {blogPosts.filter(p => p.slug !== slug).slice(0, 3).map(related => (
              <Link
                key={related.slug}
                to={`/blog/${related.slug}`}
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
