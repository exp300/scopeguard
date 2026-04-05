import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const FREE_LIMIT = 5;

export default function Billing() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Stripe redirect back
  const successParam = searchParams.get('success');
  const canceledParam = searchParams.get('canceled');

  useEffect(() => {
    if (successParam) {
      // Refresh user to pick up new plan from webhook
      const poll = setInterval(async () => {
        await refreshUser();
        if (user?.plan === 'pro') clearInterval(poll);
      }, 2000);
      setTimeout(() => clearInterval(poll), 30000);
    }
  }, [successParam]);

  async function handleUpgrade() {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/billing/checkout');
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start checkout');
      setLoading(false);
    }
  }

  async function handleManage() {
    setError('');
    setPortalLoading(true);
    try {
      const res = await api.post('/billing/portal');
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to open billing portal');
      setPortalLoading(false);
    }
  }

  const isPro = user?.plan === 'pro';
  const analysesLeft = isPro ? null : Math.max(0, FREE_LIMIT - (user?.analyses_used ?? 0));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your ScopeGuard plan</p>
      </div>

      {/* Success banner */}
      {successParam && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-medium text-green-800">
              {isPro ? 'You\'re now on Pro! Unlimited analyses unlocked.' : 'Payment received — activating your plan…'}
            </p>
            <p className="text-xs text-green-700 mt-0.5">It may take a few seconds to update.</p>
          </div>
        </div>
      )}

      {/* Canceled banner */}
      {canceledParam && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Checkout canceled. No charge was made.</p>
        </div>
      )}

      {/* Current plan */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Current Plan</h2>
        <div className={`rounded-xl p-5 flex items-center justify-between ${
          isPro ? 'bg-brand-50 border-2 border-brand-200' : 'bg-gray-50 border-2 border-gray-200'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{isPro ? '⭐' : '🆓'}</span>
              <span className="font-bold text-lg text-gray-900">{isPro ? 'Pro Plan' : 'Free Plan'}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {isPro
                ? 'Unlimited analyses · Priority AI · Full history'
                : `${analysesLeft} of ${FREE_LIMIT} analyses remaining`}
            </p>
            {!isPro && analysesLeft === 0 && (
              <p className="text-xs text-red-600 mt-1">⚠️ Limit reached — upgrade to continue</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{isPro ? '$19' : '$0'}</p>
            <p className="text-sm text-gray-400">/month</p>
          </div>
        </div>
      </div>

      {/* Plan comparison */}
      <div className="grid sm:grid-cols-2 gap-4">
        <PlanCard
          name="Free"
          price="$0"
          features={[
            '5 analyses total',
            'Contract PDF upload',
            'AI verdict + clause citation',
            'Suggested client replies',
            'Analysis history',
          ]}
          active={!isPro}
          cta={null}
        />
        <PlanCard
          name="Pro"
          price="$19/mo"
          features={[
            'Unlimited analyses',
            'Everything in Free',
            'Unlimited contracts',
            'Revenue protected tracking',
            'Priority Claude AI',
          ]}
          active={isPro}
          highlight
          cta={
            isPro ? null : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary w-full mt-4"
              >
                {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro'}
              </button>
            )
          }
        />
      </div>

      {/* Manage subscription */}
      {isPro && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Manage Subscription</h2>
          <p className="text-sm text-gray-500 mb-4">
            Update payment method, view invoices, or cancel — all through the Stripe customer portal.
          </p>
          <button
            onClick={handleManage}
            disabled={portalLoading}
            className="btn-secondary"
          >
            {portalLoading ? 'Opening portal…' : 'Manage billing →'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* FAQ */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">FAQ</h2>
        <dl className="space-y-4">
          {[
            ['Do unused analyses carry over?', 'Free tier analyses do not carry over. Pro plan has unlimited analyses, so there\'s nothing to carry over.'],
            ['Can I cancel anytime?', 'Yes. Cancel through the billing portal and you\'ll keep Pro until the end of the billing period.'],
            ['What payment methods are accepted?', 'All major credit and debit cards via Stripe. No PayPal at this time.'],
            ['Is my contract data safe?', 'Contract text is stored encrypted in our database and used only for your analyses. We never share or train on your data.'],
          ].map(([q, a]) => (
            <div key={q}>
              <dt className="text-sm font-medium text-gray-800">{q}</dt>
              <dd className="text-sm text-gray-500 mt-0.5">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function PlanCard({ name, price, features, active, highlight, cta }) {
  return (
    <div className={`card p-5 ${active && highlight ? 'border-2 border-brand-400 bg-brand-50/30' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900">{name}</h3>
        {active && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            highlight ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'
          }`}>
            Current
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-4">{price}</p>
      <ul className="space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`text-xs ${highlight ? 'text-brand-500' : 'text-gray-400'}`}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      {cta}
    </div>
  );
}
