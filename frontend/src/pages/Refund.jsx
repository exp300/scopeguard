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

      <Section title="2. Pro Subscription — 7-Day Money-Back Guarantee">
        <p>If you upgrade to ScopeGuard Pro ($19/month) and are not satisfied, you may request a full refund within <strong>7 days</strong> of your first payment. To request a refund:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Email <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a> with the subject line "Refund Request"</li>
          <li>Include the email address associated with your account</li>
          <li>Briefly describe why the Service did not meet your expectations (optional but appreciated)</li>
        </ol>
        <p className="mt-3">Refunds are processed within 5–10 business days and returned to your original payment method via Stripe.</p>
      </Section>

      <Section title="3. Renewal Charges">
        <p>Monthly renewal charges are generally non-refundable. If you forgot to cancel before a renewal date, contact us within <strong>48 hours</strong> of the charge and we will review your request on a case-by-case basis. We are not obligated to refund renewal charges but will try to accommodate genuine mistakes.</p>
      </Section>

      <Section title="4. Free Tier">
        <p>The Free tier is provided at no charge. There is nothing to refund for free accounts.</p>
      </Section>

      <Section title="5. Promo Code Activations">
        <p>Pro access granted via a promo code is provided free of charge. No payment is taken, so no refund applies.</p>
      </Section>

      <Section title="6. Cancellations">
        <p>Cancelling your subscription prevents future charges but does not automatically trigger a refund for the current billing period. You retain Pro access until the end of the period you have paid for. If you also want a refund for the current period, submit a refund request as described in Section 2.</p>
      </Section>

      <Section title="7. Exceptions">
        <p>We reserve the right to deny refund requests if there is evidence of abuse (e.g., repeated refund requests, or accounts that have consumed a large volume of analyses and then request a refund).</p>
      </Section>

      <Section title="8. Contact">
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
