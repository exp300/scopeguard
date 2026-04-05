import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import ContractUploadModal from '../components/ContractUploadModal';
import VerdictBadge from '../components/VerdictBadge';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/contracts'),
      api.get('/analysis'),
      api.get('/analysis/stats/summary'),
    ]).then(([c, a, s]) => {
      setContracts(c.data.contracts);
      setRecentAnalyses(a.data.analyses.slice(0, 5));
      setStats(s.data.stats);
    }).finally(() => setLoading(false));
  }, []);

  async function handleDeleteContract(id) {
    if (!confirm('Delete this contract and all its analyses?')) return;
    await api.delete(`/contracts/${id}`);
    setContracts(cs => cs.filter(c => c.id !== id));
  }

  async function handleContractUploaded(contract) {
    setContracts(cs => [contract, ...cs]);
    setUploadOpen(false);
  }

  const FREE_LIMIT = 5;
  const isFree = user?.plan === 'free';

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Upload Contract
        </button>
      </div>

      {/* Free tier usage banner */}
      {isFree && (
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
          stats?.analyses_used >= FREE_LIMIT
            ? 'bg-red-50 border border-red-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {stats?.analyses_used >= FREE_LIMIT
                ? 'Free tier limit reached'
                : `Free tier: ${stats?.analyses_used ?? 0} / ${FREE_LIMIT} analyses used`}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {stats?.analyses_used >= FREE_LIMIT
                ? 'Upgrade to Pro to run unlimited analyses'
                : `${FREE_LIMIT - (stats?.analyses_used ?? 0)} analyses remaining`}
            </p>
          </div>
          <Link to="/billing" className="btn-primary text-sm px-3 py-1.5">
            Upgrade — $19/mo
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue Protected"
          value={`$${(stats?.revenue_protected || 0).toLocaleString()}`}
          sub="based on your hourly rate"
          highlight
        />
        <StatCard
          label="Analyses Run"
          value={stats?.total_analyses ?? 0}
          sub="all time"
        />
        <StatCard
          label="Out-of-Scope Caught"
          value={stats?.out_of_scope_count ?? 0}
          sub="requests blocked"
          color="red"
        />
        <StatCard
          label="Contracts"
          value={contracts.length}
          sub="active projects"
        />
      </div>

      {/* Hourly rate nudge */}
      {!user?.hourly_rate && (
        <HourlyRatePrompt onUpdated={refreshUser} />
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Contracts list — 3 cols */}
        <div className="lg:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Your Contracts</h2>
            {contracts.length > 0 && (
              <button onClick={() => setUploadOpen(true)} className="text-xs text-brand-600 hover:underline">
                + Add new
              </button>
            )}
          </div>

          {contracts.length === 0 ? (
            <EmptyContracts onUpload={() => setUploadOpen(true)} />
          ) : (
            <ul className="space-y-2">
              {contracts.map(c => (
                <li key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">📄</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.analysis_count} {c.analysis_count === 1 ? 'analysis' : 'analyses'} · {fmtDate(c.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={() => navigate(`/analyze/${c.id}`)}
                      className="text-xs btn-secondary py-1 px-2.5"
                    >
                      Analyze
                    </button>
                    <button
                      onClick={() => handleDeleteContract(c.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent analyses — 2 cols */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Analyses</h2>
            {recentAnalyses.length > 0 && (
              <Link to="/history" className="text-xs text-brand-600 hover:underline">View all</Link>
            )}
          </div>

          {recentAnalyses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No analyses yet</p>
          ) : (
            <ul className="space-y-3">
              {recentAnalyses.map(a => (
                <li key={a.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-400 truncate">{a.contract_name}</p>
                    <VerdictBadge verdict={a.verdict} size="xs" />
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{a.client_message}</p>
                  <p className="text-xs text-gray-400">{fmtDate(a.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {uploadOpen && (
        <ContractUploadModal
          onClose={() => setUploadOpen(false)}
          onUploaded={handleContractUploaded}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, sub, highlight, color }) {
  return (
    <div className={`card p-4 ${highlight ? 'bg-brand-50 border-brand-100' : ''}`}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${
        highlight ? 'text-brand-600' : color === 'red' ? 'text-red-500' : 'text-gray-900'
      }`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function EmptyContracts({ onUpload }) {
  return (
    <div className="text-center py-8">
      <p className="text-3xl mb-2">📋</p>
      <p className="text-sm font-medium text-gray-700">No contracts yet</p>
      <p className="text-xs text-gray-400 mt-1 mb-4">Upload a PDF contract to get started</p>
      <button onClick={onUpload} className="btn-primary text-sm">
        Upload your first contract
      </button>
    </div>
  );
}

function HourlyRatePrompt({ onUpdated }) {
  const [rate, setRate] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!rate || isNaN(rate)) return;
    setSaving(true);
    await api.patch('/auth/hourly-rate', { hourly_rate: parseInt(rate) });
    setSaving(false);
    onUpdated();
  }

  return (
    <div className="card p-4 flex items-center gap-4 border-dashed">
      <span className="text-2xl">💰</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">Set your hourly rate to track revenue protected</p>
        <p className="text-xs text-gray-400">We'll calculate how much each out-of-scope request would've cost you</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm text-gray-500">$</span>
        <input
          type="number"
          className="input w-20 text-sm"
          placeholder="150"
          value={rate}
          onChange={e => setRate(e.target.value)}
          min="0"
        />
        <span className="text-sm text-gray-500">/hr</span>
        <button onClick={save} disabled={saving} className="btn-primary text-sm py-1.5 px-3">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-64 bg-gray-200 rounded-xl" />
        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
