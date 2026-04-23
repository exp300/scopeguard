import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: 'Scope & Deliverables',
    clauses: [
      {
        title: '"Unlimited Revisions"',
        example: '"The contractor will provide revisions until the client is satisfied."',
        danger: 'No ceiling on your time. A client can request changes forever with no end in sight, turning a fixed-price project into a perpetual labor contract.',
        fix: 'Specify the exact number included: "Up to 3 rounds of revisions are included. Additional rounds are billed at $X/hr."',
      },
      {
        title: '"All Necessary Work"',
        example: '"Contractor will perform all work necessary to complete the project."',
        danger: '"Necessary" is defined by the client, not you. This clause is a blank check — they can keep adding tasks under the guise of them being "necessary."',
        fix: 'Replace with a detailed Scope of Work. Anything not listed is explicitly excluded: "Work not described in this SOW requires a written change order."',
      },
      {
        title: '"Final Approval" Payment',
        example: '"Payment is due upon client approval of final deliverables."',
        danger: 'Client can indefinitely delay or withhold approval, which means you never get paid. There\'s zero incentive for them to sign off.',
        fix: '"Payment is due within 14 days of delivery, regardless of client approval. Feedback received after payment will be addressed in a separate engagement."',
      },
      {
        title: 'Vague Milestone Definitions',
        example: '"Phase 1: Design. Phase 2: Development. Phase 3: Launch."',
        danger: 'No one can agree on what "design complete" means. This leads to endless disputes about whether a phase is done.',
        fix: 'Define each milestone with specific, measurable deliverables: "Phase 1 complete upon delivery of 3 homepage mockups in Figma with a clickable prototype."',
      },
    ],
  },
  {
    name: 'Intellectual Property',
    clauses: [
      {
        title: '"Work for Hire" with Full IP Transfer',
        example: '"All work product created under this agreement is considered work made for hire."',
        danger: 'In many jurisdictions, "work for hire" from a contractor is a legal fiction — and even where it applies, you surrender all rights including the right to show it in your portfolio.',
        fix: 'Retain ownership until paid in full: "IP transfers to client upon receipt of final payment. Contractor retains the right to display work in portfolio."',
      },
      {
        title: 'Retroactive IP Assignment',
        example: '"Contractor assigns all inventions, ideas, and developments made during the term of this agreement."',
        danger: '"During the term" can be interpreted to include personal projects, side work, or anything you create while the contract is active — even if unrelated.',
        fix: 'Add a carve-out: "This assignment excludes inventions unrelated to client\'s business and developed entirely on contractor\'s own time without company resources."',
      },
      {
        title: 'Perpetual License Without Compensation',
        example: '"Client grants contractor a perpetual, irrevocable license to use client materials."',
        danger: 'This is usually reversed — it means you\'re giving the client a perpetual license to do whatever they want with your work. Irrevocable means you can\'t take it back even if they don\'t pay.',
        fix: '"License to use deliverables is contingent on full payment of all invoices. Unpaid deliverables remain contractor\'s exclusive property."',
      },
    ],
  },
  {
    name: 'Non-Compete & Exclusivity',
    clauses: [
      {
        title: 'Overly Broad Non-Compete',
        example: '"Contractor agrees not to provide services to any company in a similar industry for 2 years."',
        danger: 'If you\'re a web designer for a restaurant, this could bar you from working with any restaurant for 2 years. It effectively kills a significant portion of your market.',
        fix: 'Limit scope dramatically: "Contractor agrees not to directly solicit client\'s customers or provide the same specific service to [named direct competitor] for 6 months."',
      },
      {
        title: 'Implied Exclusivity',
        example: '"Contractor will dedicate full attention and resources to client projects."',
        danger: '"Full attention" sounds like an exclusivity clause. Client can later argue you violated the contract by taking other work.',
        fix: '"Contractor will devote reasonable professional effort to complete deliverables by agreed deadlines. Contractor may accept other clients concurrently."',
      },
    ],
  },
  {
    name: 'Payment Terms',
    clauses: [
      {
        title: 'Net-60 or Longer Payment Terms',
        example: '"Invoices are due Net-60 from the date of receipt."',
        danger: 'You\'re financing the client\'s business for 2 months on every invoice. At scale this destroys your cash flow, and slow-paying clients will always push to the limit.',
        fix: 'Negotiate Net-14 or Net-30. Add late fees: "Invoices unpaid after 30 days accrue 1.5% monthly interest." Require 50% upfront on projects over $X.',
      },
      {
        title: 'Payment Tied to Third-Party Approval',
        example: '"Payment is contingent upon approval from client\'s management / funding round."',
        danger: 'You have zero control over whether their manager approves or their funding closes. You\'ve already done the work.',
        fix: 'Remove conditional language entirely. Payment should be tied to your delivery, not their internal processes: "Payment due 14 days from invoice date."',
      },
      {
        title: 'No Kill Fee',
        example: '(Absence of any termination clause or compensation for cancellation)',
        danger: 'If the project is cancelled mid-way, you get nothing for completed work unless you\'ve already invoiced it. Projects get cancelled all the time — often right after you\'ve done the hardest part.',
        fix: '"If client terminates the project, all work completed to date is billed at the agreed rate and due immediately. A kill fee of 25% of remaining contract value applies."',
      },
    ],
  },
  {
    name: 'Liability & Indemnification',
    clauses: [
      {
        title: 'Unlimited Liability',
        example: '"Contractor shall be liable for all damages arising from this agreement."',
        danger: '"All damages" can include consequential, indirect, and punitive damages. A bug in a landing page could theoretically expose you to liability for the client\'s entire lost revenue.',
        fix: '"Contractor\'s total liability under this agreement shall not exceed the fees paid in the 3 months prior to the claim. Neither party is liable for indirect or consequential damages."',
      },
      {
        title: 'Mutual Indemnification That Isn\'t Mutual',
        example: '"Contractor shall indemnify, defend, and hold harmless Client from any claims arising from Contractor\'s work."',
        danger: 'If the indemnification only flows one direction (contractor → client), you\'re covering the client\'s legal costs even when the claim has nothing to do with your work.',
        fix: 'Require mutual indemnification: each party indemnifies the other for their own acts. Add a carve-out: "only to the extent caused by contractor\'s gross negligence or willful misconduct."',
      },
      {
        title: 'IP Indemnification Without Boundaries',
        example: '"Contractor warrants that deliverables do not infringe any third-party IP rights."',
        danger: 'You can\'t control what the client provides (logos, stock images, copy). If client-provided materials infringe, you could still be on the hook.',
        fix: '"Contractor warrants that contractor-created elements of deliverables do not knowingly infringe third-party IP. Client is responsible for obtaining necessary licenses for all materials provided to contractor."',
      },
    ],
  },
  {
    name: 'Termination',
    clauses: [
      {
        title: 'Termination for Convenience Without Compensation',
        example: '"Either party may terminate this agreement with 7 days written notice."',
        danger: 'Client can bail out 7 days before launch, after you\'ve done 95% of the work, and legally owe you nothing beyond what was invoiced.',
        fix: 'Tie termination to a kill fee and payment for all completed work: "Termination requires payment for all work completed to date at the hourly rate, plus a 20% kill fee of the remaining contract value."',
      },
      {
        title: 'Client\'s Right to Pause Indefinitely',
        example: '"Client may pause the project at any time by written notice."',
        danger: 'You\'ve blocked off this client in your schedule. A "pause" that lasts 6 months means you can\'t take other work and aren\'t getting paid.',
        fix: '"Project may be paused for up to 30 days. Pauses exceeding 30 days are treated as cancellations and subject to the kill fee clause. Re-engagement requires a new statement of work."',
      },
    ],
  },
];

export default function ClauseLibrary() {
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-gray-900">ScopeGuard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full">Free Resource</span>
            <Link to="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Sign up free →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Freelance Contract Red Flag Clause Library
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {CATEGORIES.reduce((sum, c) => sum + c.clauses.length, 0)} clauses that freelancers commonly miss —
            what they say, why they're dangerous, and exactly how to negotiate better language.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                onClick={() => {
                  const el = document.getElementById(c.name);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {CATEGORIES.map(cat => (
            <section key={cat.name} id={cat.name}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-500 rounded-full inline-block" />
                {cat.name}
              </h2>
              <div className="space-y-4">
                {cat.clauses.map((clause, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setOpenCategory(openCategory === `${cat.name}-${i}` ? null : `${cat.name}-${i}`)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                        <span className="font-semibold text-gray-900">{clause.title}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{openCategory === `${cat.name}-${i}` ? '↑' : '↓'}</span>
                    </button>

                    {openCategory === `${cat.name}-${i}` && (
                      <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                        <div className="pt-4">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Typically reads as</p>
                          <blockquote className="text-sm text-gray-700 italic bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                            {clause.example}
                          </blockquote>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Why it's dangerous</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{clause.danger}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Better language</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{clause.fix}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-brand-600 rounded-2xl p-8 text-white text-center">
          <h2 className="font-bold text-2xl mb-2">Already have a contract with some of these?</h2>
          <p className="text-brand-100 mb-6 max-w-lg mx-auto">
            Upload it to ScopeGuard. When a client sends a new request, you'll know in seconds
            whether it's in scope — with a ready-to-send reply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-brand-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Start free — no credit card
            </Link>
            <Link
              to="/contract-checker"
              className="inline-block bg-brand-500 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-400 transition-colors border border-brand-400"
            >
              Try the free scope checker →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-600">thescopeguard.com</Link>
        {' · '}
        <Link to="/contract-checker" className="hover:text-gray-600">Contract Scope Checker</Link>
        {' · '}
        <Link to="/change-order-generator" className="hover:text-gray-600">Change Order Generator</Link>
        {' · '}
        <Link to="/privacy" className="hover:text-gray-600">Privacy</Link>
      </footer>
    </div>
  );
}
