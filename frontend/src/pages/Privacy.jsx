import React from 'react';
import { Link } from 'react-router-dom';

const EFFECTIVE_DATE = 'April 8, 2026';
const CONTACT = 'support@scopeguard.io';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" effective={EFFECTIVE_DATE}>
      <Section title="1. Overview">
        <p>ScopeGuard ("we", "our", "us") respects your privacy. This Privacy Policy explains what data we collect, how we use it, and your rights. By using the Service you agree to this policy.</p>
      </Section>

      <Section title="2. Information We Collect">
        <h3 className="font-medium text-gray-800 mt-3 mb-1">Account data</h3>
        <p>When you register, we collect your name, email address, and a hashed password. We never store your password in plain text.</p>

        <h3 className="font-medium text-gray-800 mt-3 mb-1">Contract data</h3>
        <p>When you upload a contract PDF, we extract and store the text content to run analyses. You can delete your contracts at any time.</p>

        <h3 className="font-medium text-gray-800 mt-3 mb-1">Usage data</h3>
        <p>We store the analyses you run (client messages, verdicts, reasoning, suggested replies) so you can review your history. This data is private to your account.</p>

        <h3 className="font-medium text-gray-800 mt-3 mb-1">Payment data</h3>
        <p>Payments are processed by Stripe. We store only your Stripe customer ID and subscription ID — we never see or store your full card number.</p>

        <h3 className="font-medium text-gray-800 mt-3 mb-1">Log data</h3>
        <p>Our servers automatically record standard web logs (IP address, browser type, pages visited, timestamps) for security and debugging purposes.</p>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul className="list-disc pl-5 space-y-1">
          <li>To provide and improve the Service</li>
          <li>To authenticate you and keep your account secure</li>
          <li>To process payments and manage your subscription</li>
          <li>To send transactional emails (password reset, billing receipts)</li>
          <li>To diagnose errors and monitor Service health</li>
        </ul>
        <p className="mt-3"><strong>We do not sell your data.</strong> We do not use your contract text or analysis history to train AI models. We do not share your personal data with third parties except as described in Section 4.</p>
      </Section>

      <Section title="4. Third-Party Services">
        <p>We use the following sub-processors:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Railway</strong> — cloud hosting and database</li>
          <li><strong>Google (Gemini API)</strong> — AI analysis of contract text</li>
          <li><strong>Stripe</strong> — payment processing</li>
          <li><strong>Resend</strong> — transactional email delivery</li>
        </ul>
        <p className="mt-3">Each processor is bound by their own privacy policy and applicable data protection law. Contract text is sent to Google's Gemini API to perform analysis and is subject to Google's API data usage policies.</p>
      </Section>

      <Section title="5. Data Retention">
        <p>We retain your account data for as long as your account is active. If you delete your account, we delete your personal data within 30 days, except where we are required to retain it for legal or financial compliance.</p>
      </Section>

      <Section title="6. Security">
        <p>We use industry-standard measures including encrypted connections (TLS), hashed passwords (bcrypt), and access controls. No system is perfectly secure — if you discover a vulnerability, please email <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a>.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to or restrict certain processing</li>
          <li>Data portability (receive your data in a machine-readable format)</li>
        </ul>
        <p className="mt-3">To exercise any of these rights, email <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a>.</p>
      </Section>

      <Section title="8. Cookies">
        <p>We use only essential session-related browser storage (localStorage) to keep you logged in. We do not use advertising cookies or third-party tracking pixels.</p>
      </Section>

      <Section title="9. Children">
        <p>The Service is not directed at children under 16. We do not knowingly collect personal data from anyone under 16. If you believe we have done so inadvertently, contact us and we will delete it promptly.</p>
      </Section>

      <Section title="10. Changes">
        <p>We may update this policy. We'll notify you of material changes by posting a notice in the app or emailing your registered address. The effective date at the top of this page will be updated accordingly.</p>
      </Section>

      <Section title="11. Contact">
        <p>Privacy questions or requests: <a href={`mailto:${CONTACT}`} className="text-brand-600 hover:underline">{CONTACT}</a></p>
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
