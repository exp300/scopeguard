import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Nav />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <PainSection />
      <Pricing />
      <PrivacySection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-gray-900">ScopeGuard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
            Try Free
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-red-100">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        57% of freelancers lose $10,000/year to scope creep
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
        Stop Working{' '}
        <span className="relative inline-block">
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">
            for Free
          </span>
          {/* underline squiggle */}
          <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
            <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="#4f6ef7" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
          </svg>
        </span>
      </h1>

      {/* Sub */}
      <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
        Paste any client message. ScopeGuard reads your contract and tells you instantly —
        in scope or out. With a{' '}
        <span className="text-gray-800 font-medium">ready-to-send reply</span>.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
        <Link
          to="/register"
          className="btn-primary text-base px-8 py-3 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow"
        >
          Try Free — No Credit Card
        </Link>
        <a href="#how" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          See how it works ↓
        </a>
      </div>

      {/* Privacy badge */}
      <div className="inline-flex items-center gap-2 text-xs text-gray-400 mb-10 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
        <span>🔒</span>
        <span>Your contracts never leave our servers unencrypted. Text is extracted for analysis only and never shared.</span>
      </div>

      {/* Mockup */}
      <MockupUI />
    </section>
  );
}

function MockupUI() {
  const [active, setActive] = useState('out'); // 'in' | 'out' | 'ambiguous'

  const tabs = [
    { id: 'out',       label: '🚫 Out of Scope', color: 'text-red-600' },
    { id: 'in',        label: '✅ In Scope',     color: 'text-green-600' },
    { id: 'ambiguous', label: '⚠️ Ambiguous',    color: 'text-yellow-600' },
  ];

  const results = {
    out: {
      badge: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Out of Scope' },
      confidence: 94,
      message: '"While you\'re at it, can you also redesign the mobile nav and add a dark mode toggle? Shouldn\'t take long."',
      clause: '"Deliverables are limited to the homepage, about page, and contact form as specified in Section 2.1."',
      reasoning: 'Mobile navigation redesign and dark mode are not mentioned anywhere in the contract scope. These are new features that would require a separate agreement.',
      reply: 'Hi! Those are great ideas — dark mode and mobile nav redesign aren\'t included in our current agreement (Section 2.1). I\'d love to add them in a follow-up project. I can send over a quick quote if you\'re interested!',
    },
    in: {
      badge: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'In Scope' },
      confidence: 91,
      message: '"Can you fix the button alignment issue on the contact form? It looks off on mobile."',
      clause: '"Contractor will fix bugs and visual inconsistencies reported within 14 days of delivery (Section 4.2 — Revisions)."',
      reasoning: 'This is a visual bug on an included deliverable, reported within the revision window. It clearly falls under the revisions clause.',
      reply: 'Absolutely, happy to fix that! I\'ll get the contact form button alignment sorted on mobile and send you an updated version shortly.',
    },
    ambiguous: {
      badge: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Ambiguous' },
      confidence: 58,
      message: '"Can you make the site more professional looking? The client wants it to feel more premium."',
      clause: '"Contractor will deliver a design consistent with the approved mockups (Section 2.3)."',
      reasoning: '"More professional" is subjective and not defined in the contract. If this requires changes beyond approved mockups, it may constitute new work.',
      reply: 'I want to make sure we\'re aligned! Could you share specific examples of what "more premium" looks like to you? If the changes go beyond our approved mockups, I\'ll send a brief scope addendum — otherwise happy to iterate within what we agreed.',
    },
  };

  const r = results[active];

  return (
    <div className="relative max-w-2xl mx-auto text-left">
      {/* Glow */}
      <div className="absolute -inset-4 bg-gradient-to-b from-brand-100/40 to-transparent rounded-3xl blur-2xl -z-10" />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Mock browser bar */}
        <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 text-center">
              app.scopeguard.io/analyze
            </div>
          </div>
        </div>

        {/* Verdict toggle tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                active === t.id
                  ? `${t.color} bg-white border-b-2 border-current`
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Client message input */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">Client Message</p>
            <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-600 border border-gray-100 italic">
              {r.message}
            </div>
          </div>

          {/* Verdict */}
          <div className={`${r.badge.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${r.badge.bg} ${r.badge.text} border border-current/20`}>
                <span className={`w-1.5 h-1.5 rounded-full ${r.badge.dot}`} />
                {r.badge.label}
              </span>
              <span className="text-xs text-gray-400">Confidence: {r.confidence}%</span>
            </div>
            <p className="text-xs text-gray-600">{r.reasoning}</p>
          </div>

          {/* Clause */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">📋 Relevant Clause</p>
            <blockquote className="text-xs text-gray-600 italic border-l-3 border-brand-200 pl-3 py-0.5 bg-brand-50/40 rounded-r">
              {r.clause}
            </blockquote>
          </div>

          {/* Reply */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-gray-400">✉️ Suggested Reply</p>
              <span className="text-xs text-brand-500 font-medium cursor-default">Copy →</span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-xs text-gray-600 border border-gray-100 leading-relaxed">
              {r.reply}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Social Proof ─────────────────────────────────────────────────────── */
function SocialProof() {
  return (
    <section className="bg-gray-950 text-white py-14">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <Stat number="57%" label="of freelancers lose money" sub="to unpaid scope creep every year" />
          <Stat number="$10,000" label="lost per freelancer" sub="in unbilled out-of-scope work annually" highlight />
          <Stat number="$650/mo" label="protected on average" sub="by ScopeGuard users who track revenue" />
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">
          Sources: Ignition 2025 Freelance Report · PMI Scope Creep Survey
        </p>
      </div>
    </section>
  );
}

function Stat({ number, label, sub, highlight }) {
  return (
    <div>
      <p className={`text-4xl font-extrabold mb-1 ${highlight ? 'text-brand-400' : 'text-white'}`}>
        {number}
      </p>
      <p className="text-sm font-semibold text-gray-200">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

/* ─── How It Works ─────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: '📄',
      step: '01',
      title: 'Upload your contract',
      desc: 'Drop in your PDF once per project. ScopeGuard extracts and remembers every clause.',
    },
    {
      icon: '💬',
      step: '02',
      title: 'Paste the client message',
      desc: 'Copy-paste their email, Slack message, or WhatsApp text. Exactly as written.',
    },
    {
      icon: '⚡',
      step: '03',
      title: 'Get an instant verdict',
      desc: 'In scope, out of scope, or ambiguous — with the exact clause cited and a reply ready to send.',
    },
  ];

  return (
    <section id="how" className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-3">How it works</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          From message to answer in 10 seconds
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 relative">
        {/* Connector line */}
        <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100" />

        {steps.map((s, i) => (
          <div key={i} className="relative text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 border-2 border-brand-100 text-3xl mb-4 z-10">
              {s.icon}
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Pain Section ─────────────────────────────────────────────────────── */
function PainSection() {
  const quotes = [
    {
      text: '"Client wants one small change for the 8th time this week. Still calls it a minor tweak."',
      handle: 'r/freelance · 4.2k upvotes',
    },
    {
      text: '"They said the logo wasn\'t included in the project. Now they want three versions and a brand guide."',
      handle: 'r/webdev · 2.8k upvotes',
    },
    {
      text: '"I feel too awkward to push back so I just do it for free and resent the client for a week."',
      handle: 'r/freelance · 6.1k upvotes',
    },
  ];

  return (
    <section className="bg-gray-50 border-y border-gray-100 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">The reality</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Sound familiar?</h2>
          <p className="text-gray-500 mt-3">Real complaints from the freelance community — thousands of upvotes each.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4">
              <p className="text-2xl">😩</p>
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{q.text}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">r/</div>
                <p className="text-xs text-gray-400">{q.handle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="inline-block bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-base font-semibold text-gray-800">
              ScopeGuard gives you the answer you already know — <span className="text-brand-600">but with your contract to back it up.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ──────────────────────────────────────────────────────────── */
function Pricing() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-3">Pricing</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Simple, honest pricing</h2>
        <p className="text-gray-500 mt-3">Start free. Upgrade when you're protecting real money.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Free */}
        <div className="card p-7 flex flex-col">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Free</p>
          <p className="text-4xl font-extrabold text-gray-900 mb-1">$0</p>
          <p className="text-sm text-gray-400 mb-6">Forever free, no card needed</p>
          <ul className="space-y-3 flex-1 mb-7">
            {[
              '5 scope analyses',
              'Unlimited contract uploads',
              'AI verdict + clause citation',
              'Suggested client replies',
              'Analysis history',
            ].map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="text-gray-300 mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="btn-secondary w-full text-center text-sm py-2.5">
            Get started free
          </Link>
        </div>

        {/* Pro */}
        <div className="relative card p-7 flex flex-col border-2 border-brand-400 bg-brand-50/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Most popular
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-1">Pro</p>
          <div className="flex items-end gap-1 mb-1">
            <p className="text-4xl font-extrabold text-gray-900">$19</p>
            <p className="text-sm text-gray-400 mb-1.5">/month</p>
          </div>
          <p className="text-sm text-gray-400 mb-6">Cancel anytime</p>
          <ul className="space-y-3 flex-1 mb-7">
            {[
              'Unlimited analyses',
              'Everything in Free',
              'Revenue protected tracker',
              'Full analysis history',
              'Priority AI processing',
            ].map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium">
                <span className="text-brand-500 mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="btn-primary w-full text-center text-sm py-2.5 shadow-md shadow-brand-500/20">
            Start with Pro
          </Link>
          <p className="text-xs text-center text-gray-400 mt-3">
            Pays for itself after one blocked request
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Privacy Section ──────────────────────────────────────────────────── */
function PrivacySection() {
  const items = [
    {
      icon: '📄',
      title: 'Text extraction only',
      body: 'We extract text from your PDF to run the AI analysis. The original file is deleted from our servers immediately after parsing.',
    },
    {
      icon: '🚫',
      title: 'Never sold or shared',
      body: 'Your contract text and analysis history are private to your account. We never sell, share, or use your data to train AI models.',
    },
    {
      icon: '🔐',
      title: 'Encrypted at rest',
      body: 'Contract text is encrypted with AES-256 before being written to the database. Even a database leak exposes no readable contract content.',
    },
    {
      icon: '🗑️',
      title: 'Delete anytime',
      body: 'You own your data. Delete any contract from your dashboard at any time and it is permanently removed from our database.',
    },
  ];

  return (
    <section className="bg-gray-50 border-y border-gray-100 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Privacy</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Your contracts stay yours</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            You're uploading sensitive legal documents. Here's exactly how we handle them.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <p className="text-3xl mb-4">{item.icon}</p>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Read our full <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link> for details.
        </p>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="bg-gray-950 py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-4xl mb-6">🛡️</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          Your contract has the answer.
          <br />
          <span className="text-brand-400">Let AI find it.</span>
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Stop second-guessing yourself. Stop doing free work.
          Your contract is already protecting you — ScopeGuard just enforces it.
        </p>
        <Link
          to="/register"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-10 py-4 rounded-xl text-base shadow-xl shadow-brand-500/30 transition-all hover:shadow-brand-500/50 hover:-translate-y-0.5"
        >
          Try Free — No Credit Card Required
        </Link>
        <p className="text-gray-600 text-sm mt-4">5 free analyses · Setup in 2 minutes · Cancel anytime</p>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <span>🛡️</span>
          <span className="font-semibold text-gray-300">ScopeGuard</span>
          <span className="text-gray-700">·</span>
          <span className="text-sm">AI scope creep protection for freelancers</span>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
          <Link to="/login" className="hover:text-gray-400 transition-colors">Sign in</Link>
          <Link to="/register" className="hover:text-gray-400 transition-colors">Register</Link>
          <Link to="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          <span className="text-gray-800">·</span>
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link to="/refund" className="hover:text-gray-400 transition-colors">Refunds</Link>
          <span className="text-gray-800">·</span>
          <span>© {new Date().getFullYear()} ScopeGuard</span>
        </div>
      </div>
    </footer>
  );
}
