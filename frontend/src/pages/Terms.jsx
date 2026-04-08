import React from 'react';
import { Link } from 'react-router-dom';

const EFFECTIVE_DATE = 'April 8, 2026';
const CONTACT = 'support@scopeguard.io';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" effective={EFFECTIVE_DATE}>
      <Section title="1. Acceptance of Terms">
        <p>By accessing or using ScopeGuard ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms apply to all visitors, users, and others who access the Service.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>ScopeGuard is an AI-powered tool that helps freelancers analyze client requests against their contracts to detect scope creep. The Service uses artificial intelligence to provide verdicts, clause citations, and suggested replies. Outputs are informational only and do not constitute legal advice.</p>
      </Section>

      <Section title="3. Accounts">
        <p>You must provide accurate and complete information when creating an account. You are responsible for safeguarding your password and for all activity that occurs under your account. Notify us immediately at <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a> if you suspect unauthorized access.</p>
      </Section>

      <Section title="4. Subscription and Payment">
        <p>ScopeGuard offers a Free tier (5 analyses) and a Pro plan at <strong>$19.00 per month</strong>. Pro subscriptions are billed monthly in advance via Stripe. All fees are non-refundable except as described in our <Link to="/refund" className="text-brand-600 hover:underline">Refund Policy</Link>.</p>
        <p className="mt-3">We reserve the right to change pricing with 30 days' notice. Continued use after a price change constitutes acceptance of the new price.</p>
      </Section>

      <Section title="5. Cancellation">
        <p>You may cancel your Pro subscription at any time through the billing portal. Cancellation takes effect at the end of the current billing period. You will retain Pro access until then and will not be charged again.</p>
      </Section>

      <Section title="6. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
          <li>Upload contracts or data you do not have the right to share</li>
          <li>Attempt to reverse-engineer, scrape, or abuse the Service's AI systems</li>
          <li>Resell or sublicense access to the Service without written permission</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
        </ul>
      </Section>

      <Section title="7. Intellectual Property">
        <p>The Service, including its design, code, and AI models, is owned by ScopeGuard. Your contract data and analysis history remain yours. By using the Service, you grant ScopeGuard a limited license to process your data solely to provide the Service. We do not train AI models on your contract data.</p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT AI VERDICTS WILL BE ACCURATE. OUTPUTS ARE NOT LEGAL ADVICE — CONSULT A QUALIFIED ATTORNEY FOR LEGAL MATTERS.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCOPEGUARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF REVENUE, PROFITS, OR DATA. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNTS PAID BY YOU IN THE THREE MONTHS PRECEDING THE CLAIM.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We may update these Terms at any time. We will notify you of material changes by posting a notice in the app or emailing your registered address. Continued use of the Service after changes constitutes acceptance.</p>
      </Section>

      <Section title="11. Governing Law">
        <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.</p>
      </Section>

      <Section title="12. Contact">
        <p>Questions about these Terms? Email us at <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a>.</p>
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
