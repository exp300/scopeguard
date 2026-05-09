// Red flag clauses for individual pages and the Clause Library hub.
// Each clause has its own URL at /red-flags/:slug

export const clauseCategories = [
  { id: 'scope', name: 'Scope & Deliverables' },
  { id: 'ip', name: 'Intellectual Property' },
  { id: 'noncompete', name: 'Non-Compete & Exclusivity' },
  { id: 'payment', name: 'Payment Terms' },
  { id: 'liability', name: 'Liability & Indemnification' },
  { id: 'termination', name: 'Termination' },
];

export const clauses = [
  // ─── Scope & Deliverables ─────────────────────────────────────────────
  {
    slug: 'unlimited-revisions',
    category: 'scope',
    title: 'Unlimited Revisions',
    searchTerm: 'unlimited revisions clause freelance contract',
    metaDescription:
      'The "unlimited revisions" clause turns fixed-price freelance projects into perpetual labor contracts. Here\'s why it\'s dangerous and exactly how to rewrite it.',
    example: '"The contractor will provide revisions until the client is satisfied."',
    danger:
      'No ceiling on your time. A client can request changes forever with no end in sight, turning a fixed-price project into a perpetual labor contract. The phrase "until satisfied" is subjective — there\'s no objective trigger that says the project is done. You\'re effectively working at the client\'s mood, not at a defined endpoint.',
    fix: 'Specify the exact number included: "Up to 3 rounds of revisions are included. Additional rounds are billed at $X/hr." Define what counts as a single round: "A round of revisions consists of all consolidated feedback delivered in one written response within 5 business days of delivery."',
    realScenario:
      'A logo designer signs a $1,500 project with "unlimited revisions." Three months in, they\'ve done 27 revisions across 14 different concepts. The client keeps moving the goalpost. The designer can\'t walk away — the contract says "until satisfied" — and ends up earning roughly $8/hour by the time they finally agree to launch.',
  },
  {
    slug: 'all-necessary-work',
    category: 'scope',
    title: 'All Necessary Work',
    searchTerm: 'all necessary work clause contract',
    metaDescription:
      '"All necessary work" sounds reasonable but it\'s a blank check that lets clients add unpaid scope under the guise of "necessary." Here\'s the safer alternative.',
    example: '"Contractor will perform all work necessary to complete the project."',
    danger:
      '"Necessary" is defined by the client, not you. This clause is a blank check — they can keep adding tasks under the guise of them being "necessary" to complete the project. What the client thinks is "necessary for launch" can balloon to include analytics setup, third-party integrations, training videos, and ongoing support — none of which were in your original quote.',
    fix: 'Replace with a detailed Scope of Work. Anything not listed is explicitly excluded: "The deliverables listed in Section 2 represent the complete scope. Any work not described in this SOW requires a written change order, signed by both parties, before contractor begins the additional work."',
    realScenario:
      'A web developer agrees to "build the website with all necessary work for launch." The client later argues that SEO setup, Google Analytics integration, an email newsletter form, and a custom 404 page are all "necessary." The developer has no contractual basis to refuse, and burns 30 unpaid hours.',
  },
  {
    slug: 'final-approval-payment',
    category: 'scope',
    title: 'Payment on Final Client Approval',
    searchTerm: 'payment on final approval freelance contract',
    metaDescription:
      'Tying your payment to "client approval" lets clients delay paying you indefinitely. Here\'s why this clause is dangerous and how to fix it.',
    example: '"Payment is due upon client approval of final deliverables."',
    danger:
      'Client can indefinitely delay or withhold approval, which means you never get paid. There\'s zero incentive for them to sign off — once they approve, they owe you money. As long as they keep finding "one more thing," they keep your work for free. This is one of the most common ways freelancers get stiffed on final payments.',
    fix: '"Final payment is due within 14 days of delivery, regardless of client approval. Feedback received after the payment due date will be addressed in a separate paid engagement." Add a clear delivery definition: "Delivery means the contractor has provided the agreed deliverables in the agreed format via email or shared drive."',
    realScenario:
      'A copywriter delivers a website\'s worth of copy on July 1. The client says "looks great, just let me share with the team." Six weeks later they\'re still "gathering feedback." The copywriter has no leverage — final payment is tied to approval. They eventually accept 50% just to close the project.',
  },
  {
    slug: 'vague-milestones',
    category: 'scope',
    title: 'Vague Milestone Definitions',
    searchTerm: 'vague milestones freelance contract',
    metaDescription:
      'When "Phase 1: Design" can mean anything, you and your client will inevitably argue about whether the phase is done. Define milestones with specific deliverables.',
    example: '"Phase 1: Design. Phase 2: Development. Phase 3: Launch."',
    danger:
      'No one can agree on what "design complete" means. This leads to endless disputes about whether a phase is done, which means you can\'t invoice for completed phases, which means cash flow gets blocked. Vague milestones also invite scope creep — clients keep "polishing" Phase 1 forever rather than moving forward.',
    fix: 'Define each milestone with specific, measurable deliverables: "Phase 1 complete upon delivery of 3 homepage mockups in Figma with a clickable prototype, plus written design system documentation. Client has 5 business days to provide consolidated feedback or the phase is automatically considered approved." Make completion objective and time-boxed.',
    realScenario:
      'A designer\'s contract says "Phase 1 — Discovery, $4,000." After 3 weeks of research, surveys, and a strategy doc, the client refuses to pay because "discovery isn\'t finished, we still haven\'t finalized the strategy." The designer has no contractual definition of "finished," so they keep working another 2 weeks for free.',
  },

  // ─── IP ────────────────────────────────────────────────────────────────
  {
    slug: 'work-for-hire-full-ip-transfer',
    category: 'ip',
    title: 'Work for Hire with Full IP Transfer',
    searchTerm: 'work for hire clause freelance',
    metaDescription:
      '"Work for hire" sounds standard, but it strips your portfolio rights and often doesn\'t even protect the client legally. Here\'s the better way to handle IP.',
    example: '"All work product created under this agreement is considered work made for hire."',
    danger:
      'In many jurisdictions, "work for hire" from a contractor is a legal fiction — the doctrine technically applies only to employees in most U.S. states, so the clause may not actually transfer IP the way the client thinks. And even where it does apply, you surrender all rights including the right to show the work in your portfolio. Some clauses go further and prohibit you from saying you worked on the project at all.',
    fix: 'Retain ownership until paid in full, and reserve portfolio rights: "IP transfers to client upon receipt of final payment. Contractor retains the irrevocable right to display the work in portfolio, on personal websites, and in case studies, and to identify themselves as the creator. Client grants contractor a royalty-free license for these purposes."',
    realScenario:
      'An illustrator does a logo for a startup under "work for hire." Two years later, the startup is acquired and goes viral. The illustrator can\'t use the logo in their portfolio, can\'t mention they made it, and watches their best work disappear from their public record.',
  },
  {
    slug: 'retroactive-ip-assignment',
    category: 'ip',
    title: 'Retroactive IP Assignment',
    searchTerm: 'retroactive IP assignment freelance contract',
    metaDescription:
      'A clause that assigns "all inventions during the term" can sweep up your personal projects too. Here\'s how to add the right carve-out.',
    example:
      '"Contractor assigns all inventions, ideas, and developments made during the term of this agreement."',
    danger:
      '"During the term" can be interpreted to include personal projects, side work, or anything you create while the contract is active — even if completely unrelated to the client\'s business. If you have a side project that takes off after the engagement, the client could plausibly claim partial ownership.',
    fix: 'Add a carve-out: "This assignment is limited to work product created specifically for client and excludes inventions developed entirely on contractor\'s own time, without using client\'s confidential information, equipment, or facilities, and that do not relate to client\'s business or anticipated business." This language mirrors California Labor Code §2870, which is the gold standard.',
    realScenario:
      'A developer builds a SaaS side project on weekends while doing a 6-month contract for a SaaS company. When the side project starts gaining traction, the client claims it\'s theirs under the IP assignment clause — even though it was on the developer\'s own time and unrelated to the client\'s product.',
  },
  {
    slug: 'perpetual-license-without-compensation',
    category: 'ip',
    title: 'Perpetual License Without Payment Trigger',
    searchTerm: 'perpetual irrevocable license freelance contract',
    metaDescription:
      'A perpetual license that doesn\'t depend on payment means the client owns your work forever — even if they never pay. Here\'s how to gate the license to payment.',
    example:
      '"Client grants contractor a perpetual, irrevocable license to use client materials." (Often the reverse direction in practice.)',
    danger:
      'This is usually reversed in real contracts — it actually means you\'re giving the client a perpetual, irrevocable license to use your deliverables. "Irrevocable" means you can\'t take it back even if the client never pays. Combined with "perpetual" — you\'ve effectively given away your work for nothing if payment falls through.',
    fix: '"License to use deliverables is contingent on full payment of all outstanding invoices. Until payment is received in full, contractor retains exclusive rights to all deliverables. Use of deliverables prior to full payment constitutes an unauthorized use." This makes withholding payment a copyright infringement issue, not just a debt issue.',
    realScenario:
      'A photographer delivers final hi-res files with a "perpetual irrevocable license" granted on delivery. The client publishes them everywhere, then disputes the invoice and pays 40%. Because the license was granted on delivery (not on payment), the photographer has no legal way to compel takedown.',
  },

  // ─── Non-compete ─────────────────────────────────────────────────────
  {
    slug: 'overly-broad-non-compete',
    category: 'noncompete',
    title: 'Overly Broad Non-Compete',
    searchTerm: 'non-compete clause freelance contract',
    metaDescription:
      '"No similar industry for 2 years" can wipe out your entire market. Here\'s how to negotiate a non-compete that\'s actually enforceable and reasonable.',
    example:
      '"Contractor agrees not to provide services to any company in a similar industry for 2 years."',
    danger:
      'If you\'re a web designer for a restaurant, this could bar you from working with any restaurant for 2 years — effectively killing a significant portion of your market. Many overly broad non-competes aren\'t enforceable in court, but you\'d still need to pay legal fees to fight them, and most freelancers can\'t afford that. Better to never sign one.',
    fix: 'Limit scope dramatically, both in duration and competitor definition: "Contractor agrees not to directly solicit client\'s named existing customers, or provide the same specific service to [named direct competitor — e.g., Acme Corp\'s top 3 listed competitors] for 6 months following project completion." Specific, time-bound, narrow.',
    realScenario:
      'A marketing freelancer signs a non-compete preventing them from working with "any e-commerce company" for 18 months. They specialize in e-commerce. The clause effectively zeroes their pipeline, and they spend a year working in adjacent fields they don\'t enjoy.',
  },
  {
    slug: 'implied-exclusivity',
    category: 'noncompete',
    title: 'Implied Exclusivity',
    searchTerm: 'implied exclusivity freelance contract full attention',
    metaDescription:
      '"Full attention" sounds harmless but it\'s a stealth exclusivity clause that can be used against you later. Here\'s the language to use instead.',
    example:
      '"Contractor will dedicate full attention and resources to client projects."',
    danger:
      '"Full attention" sounds like an exclusivity clause to a lawyer. The client can later argue you violated the contract by taking other work — even if your other clients had nothing to do with theirs. Some clients deliberately use this language to lock you into de facto exclusivity without paying for it.',
    fix: '"Contractor will devote reasonable professional effort to complete deliverables by the agreed deadlines. Contractor may accept other clients concurrently, provided that other engagements do not compromise the agreed delivery schedule. Contractor is an independent contractor, not an employee, and is not subject to exclusive-service obligations."',
    realScenario:
      'A consultant takes on a 3-month engagement with "full attention" language. Halfway through, the client discovers the consultant has another client and threatens breach-of-contract. The consultant either drops the other client (losing income) or fights a lawsuit they probably win but can\'t afford.',
  },

  // ─── Payment ───────────────────────────────────────────────────────────
  {
    slug: 'net-60-payment-terms',
    category: 'payment',
    title: 'Net-60 or Longer Payment Terms',
    searchTerm: 'net 60 payment terms freelance',
    metaDescription:
      'Net-60 means you finance your client\'s business for 2 months on every invoice. Here\'s why this destroys your cash flow and how to negotiate down.',
    example: '"Invoices are due Net-60 from the date of receipt."',
    danger:
      'You\'re financing the client\'s business for 2 months on every invoice. At scale this destroys your cash flow, and slow-paying clients will always push to the limit. A Net-60 invoice from June 1 isn\'t even technically late until August 1 — and most enterprise clients add another 2 weeks of "processing time" on top. You can be doing the work and waiting 90+ days for payment.',
    fix: 'Negotiate Net-14 or Net-30 maximum. Add late fees with teeth: "Invoices unpaid 30 days after the due date accrue 1.5% monthly interest, plus collection costs and reasonable attorneys\' fees if collection becomes necessary." Require 50% upfront on projects over $X. For ongoing engagements, weekly or bi-weekly invoicing instead of monthly.',
    realScenario:
      'A development agency wins a "great" Fortune 500 client on Net-60 terms. By month 3 they\'ve completed $40K of work but received $0. By month 5 they\'re still "in the AP queue." The agency has to take a line of credit to make payroll while waiting on a guaranteed receivable.',
  },
  {
    slug: 'payment-tied-to-third-party',
    category: 'payment',
    title: 'Payment Tied to Third-Party Approval',
    searchTerm: 'payment contingent on management approval contract',
    metaDescription:
      'Payment "subject to management approval" or "after funding round closes" makes you carry the risk of someone else\'s decision. Here\'s how to remove that.',
    example:
      '"Payment is contingent upon approval from client\'s management / completion of client\'s funding round."',
    danger:
      'You have zero control over whether their manager approves or their funding round closes. You\'ve already done the work. Funding rounds get delayed, managers leave, internal politics shift. None of these things should affect whether you get paid for completed work. This clause transfers business risk from the client to you.',
    fix: 'Remove conditional language entirely. Payment should be tied to your delivery, not their internal processes: "Payment is due 14 days from invoice date. Internal approval, funding events, or third-party processing delays do not extend the payment due date." If they push back, ask for an upfront deposit instead.',
    realScenario:
      'A designer signs a "contingent on Series A" deal with a startup, betting the round will close. It doesn\'t. The startup pivots, the project is shelved, and the designer is owed $18K with no contractual right to collect — they explicitly agreed payment was contingent.',
  },
  {
    slug: 'no-kill-fee',
    category: 'payment',
    title: 'No Kill Fee for Cancellation',
    searchTerm: 'kill fee freelance contract',
    metaDescription:
      'If a client cancels mid-project and your contract has no kill fee, you can lose months of expected revenue. Here\'s the kill fee language to add.',
    example: '(Absence of any termination clause or compensation for cancellation)',
    danger:
      'If the project is cancelled mid-way, you get nothing for completed work unless you\'ve already invoiced it. Projects get cancelled all the time — often right after you\'ve done the hardest part (research, strategy, first drafts) but before final delivery. Without a kill fee, the client gets the early-stage work for whatever was already paid, and you eat the rest.',
    fix: '"If client terminates the project for any reason, all work completed to date is billed at the agreed rate and due immediately. A kill fee equal to 25% of the remaining contract value applies, payable within 14 days of termination notice. Any deposits paid are non-refundable." For phased projects, consider non-refundable phase deposits.',
    realScenario:
      'A brand designer is 60% through a $20K rebrand when the client gets acquired and the project is cancelled. With no kill fee, they\'ve already invoiced $8K, and they\'re owed $12K of expected revenue with no contractual claim. The acquired-into company never picks the project back up.',
  },

  // ─── Liability ─────────────────────────────────────────────────────────
  {
    slug: 'unlimited-liability',
    category: 'liability',
    title: 'Unlimited Liability',
    searchTerm: 'unlimited liability clause contractor',
    metaDescription:
      '"Liable for all damages" is open-ended and dangerous — a small bug could expose you to enterprise-scale claims. Here\'s the standard liability cap to use.',
    example: '"Contractor shall be liable for all damages arising from this agreement."',
    danger:
      '"All damages" can include consequential, indirect, and punitive damages. A bug in a landing page could theoretically expose you to liability for the client\'s entire lost revenue. A typo in copy could be framed as causing a missed launch. The dollar exposure is uncapped — a single project could bankrupt you if something goes wrong.',
    fix: '"Contractor\'s total cumulative liability under this agreement, regardless of the form of action, shall not exceed the fees paid to contractor in the 3 months immediately preceding the claim. Neither party shall be liable for indirect, consequential, special, incidental, or punitive damages, including lost profits or lost data, even if advised of the possibility of such damages."',
    realScenario:
      'A developer ships a checkout page with a bug that intermittently fails on Safari. The client claims $200K in "lost sales during the bug window" and demands the developer cover it. With unlimited liability, the developer has no contractual cap to point to and faces a real legal threat — even if the bug genuinely wasn\'t their fault.',
  },
  {
    slug: 'one-way-indemnification',
    category: 'liability',
    title: 'One-Way Indemnification',
    searchTerm: 'one-way indemnification freelance contract',
    metaDescription:
      'If you\'re indemnifying the client but they\'re not indemnifying you, you\'re paying their legal bills for things outside your control. Make it mutual.',
    example:
      '"Contractor shall indemnify, defend, and hold harmless Client from any claims arising from Contractor\'s work."',
    danger:
      'If the indemnification only flows one direction (contractor → client), you\'re covering the client\'s legal costs even when the claim has nothing to do with your work. A third party sues the client over how the client used your deliverables — and you\'re paying for the lawyers. One-way indemnity is a major red flag in any contract.',
    fix: 'Require mutual indemnification, where each party indemnifies the other for their own acts, with carve-outs for the indemnifier\'s gross negligence or willful misconduct. "Each party shall indemnify, defend, and hold harmless the other from third-party claims arising solely from the indemnifying party\'s gross negligence, willful misconduct, or material breach of this agreement. Neither party shall be liable for the other\'s acts or omissions."',
    realScenario:
      'A consultant\'s client gets sued by a competitor over a marketing campaign. The campaign used market positioning the client decided on. Under a one-way indemnity, the consultant is on the hook for the client\'s legal defense — even though they had no role in the strategic decision being challenged.',
  },
  {
    slug: 'ip-indemnification-without-boundaries',
    category: 'liability',
    title: 'IP Indemnification Without Boundaries',
    searchTerm: 'IP indemnification freelance client materials',
    metaDescription:
      'Warranting that "deliverables don\'t infringe IP" makes you liable for client-supplied materials too. Here\'s how to scope the warranty to your own work.',
    example:
      '"Contractor warrants that deliverables do not infringe any third-party intellectual property rights."',
    danger:
      'You can\'t control what the client provides — logos, stock images, copy, fonts, third-party assets they say they have rights to. If client-provided materials infringe, you could still be on the hook because the warranty covers "deliverables" without distinguishing what came from you vs. them. Even if you push back later, you\'ve already signed the warranty.',
    fix: '"Contractor warrants that the original elements created by contractor do not knowingly infringe third-party IP rights. Client represents and warrants that all materials provided to contractor (including but not limited to logos, images, fonts, copy, and third-party assets) are owned by client or properly licensed for the intended use, and client shall indemnify contractor for any infringement claims related to client-supplied materials."',
    realScenario:
      'A web designer integrates a font the client provided. The client didn\'t actually have the commercial license. The font foundry sends a six-figure infringement letter, and under the original warranty, the designer is named as a co-defendant. Without the carve-out, they\'re sharing legal costs.',
  },

  // ─── Termination ───────────────────────────────────────────────────────
  {
    slug: 'termination-for-convenience-no-compensation',
    category: 'termination',
    title: 'Termination for Convenience Without Compensation',
    searchTerm: 'termination for convenience freelance contract',
    metaDescription:
      'A "7 days written notice" termination clause without a kill fee lets clients walk away days before launch and pay nothing extra. Here\'s the safer language.',
    example: '"Either party may terminate this agreement with 7 days written notice."',
    danger:
      'Client can bail out 7 days before launch, after you\'ve done 95% of the work, and legally owe you nothing beyond what was invoiced. This clause is most often abused at the worst possible moment — right when their internal champion leaves, or budget gets cut, or a competitor offers cheaper. The 7-day window gives the client a free option to cancel, paid for by you.',
    fix: 'Tie termination for convenience to a kill fee plus payment for all completed work: "Termination for convenience requires (a) payment for all work completed to date, calculated at the contractor\'s hourly rate or pro-rata project rate; (b) a kill fee equal to 20% of the unpaid contract value; and (c) 14 days written notice. Termination for cause requires 30 days notice and an opportunity to cure."',
    realScenario:
      'A developer is 80% through a $30K project. The client\'s new VP wants to "reassess vendors" and terminates with 7 days notice. The developer\'s contract says they get paid only for invoiced work. They\'ve invoiced $15K of $30K, so they walk away $15K short with no recourse — months of pipeline-blocking work for half the agreed pay.',
  },
  {
    slug: 'indefinite-pause-clause',
    category: 'termination',
    title: 'Client\'s Right to Pause Indefinitely',
    searchTerm: 'project pause clause freelance contract',
    metaDescription:
      'A pause-anytime clause lets clients freeze your project for months while you can\'t take other work. Here\'s how to time-box pauses.',
    example: '"Client may pause the project at any time by written notice."',
    danger:
      'You\'ve blocked off this client in your schedule. A "pause" that lasts 6 months means you can\'t take other work and aren\'t getting paid. Worse, when the client unpauses, they expect you to drop everything and resume — which means you can\'t commit to other clients in the meantime either. Pause clauses are de facto unlimited free options on your time.',
    fix: '"Project may be paused for up to 30 days with written notice. Pauses exceeding 30 days are treated as terminations and trigger the kill fee clause. Re-engagement after termination requires a new statement of work and a new deposit. The contractor\'s hourly rate may be adjusted for any new SOW."',
    realScenario:
      'A consultant\'s client pauses a $50K engagement "for a few weeks" while they restructure. Five months later they finally reach out to resume. The consultant has had to turn down work the entire time, then has to give immediate priority to the resumed project. Net effect: 5 months of lost income plus rushed delivery.',
  },
];

export function getClause(slug) {
  return clauses.find(c => c.slug === slug);
}

export function getRelatedClauses(slug, limit = 3) {
  const current = getClause(slug);
  if (!current) return [];
  // Same category first, then any others
  const sameCategory = clauses.filter(c => c.category === current.category && c.slug !== slug);
  const otherCategory = clauses.filter(c => c.category !== current.category);
  return [...sameCategory, ...otherCategory].slice(0, limit);
}

export function getCategoryName(id) {
  return clauseCategories.find(c => c.id === id)?.name || '';
}
