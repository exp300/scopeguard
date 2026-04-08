import React from 'react';
import { Link } from 'react-router-dom';

const EFFECTIVE_DATE = 'April 8, 2026';
const CONTACT = 'support@scopeguard.io';

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy" effective={EFFECTIVE_DATE}>
      <Section title="1. Overview">
        <p>We want you to be satisfied with ScopeGuard. This Refund Policy explains when you are eligible for a refund and how to request one. For questions, contact us at <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a>.</p>
      </Section>

      <Section title="2. Pro Subscription — 14-Day Money-Back Guarantee">
        <p>We offer a full refund within <strong>14 days</strong> of purchase, no questions asked. Email <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a> to request a refund.</p>
      </Section>

      <Section title="3. Contact">
        <p>For refund requests or billing questions: <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a></p>
      </Section>
    </LegalLayout>
  );
}

function LegalLayout({ title, effective, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
            <span>←</span> Back to ScopeGuard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-2">Effective date: {effective}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 text-gray-700 leading-relaxed">
          {children}
        </div>
        <div className="mt-8 flex gap-6 text-sm text-gray-400">
          <Link to="/terms" className="hover:text-gray-600">Terms</Link>
          <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
          <Link to="/refund" className="hover:text-gray-600">Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}
