import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import VerdictBadge from '../components/VerdictBadge';
import ContractUploadModal from '../components/ContractUploadModal';

export default function Analyze() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [contracts, setContracts] = useState([]);
  const [selectedId, setSelectedId] = useState(contractId ? parseInt(contractId) : null);
  const [message, setMessage] = useState('');
  const [hoursAtRisk, setHoursAtRisk] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/contracts').then(res => {
      setContracts(res.data.contracts);
      // If no contractId in URL and only one contract, auto-select it
      if (!contractId && res.data.contracts.length === 1) {
        setSelectedId(res.data.contracts[0].id);
      }
    });
  }, []);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!selectedId) { setError('Select a contract first'); return; }
    if (!message.trim()) { setError('Paste the client message first'); return; }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await api.post('/analysis', {
        contract_id: selectedId,
        client_message: message,
        hours_at_risk: parseFloat(hoursAtRisk) || 0,
      });
      setResult(res.data.analysis);
      await refreshUser(); // refresh plan/analyses_used counter
    } catch (err) {
      if (err.response?.data?.code === 'UPGRADE_REQUIRED') {
        setError('upgrade_required');
      } else {
        setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result?.suggested_reply) return;
    navigator.clipboard.writeText(result.suggested_reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleContractUploaded(contract) {
    setContracts(cs => [contract, ...cs]);
    setSelectedId(contract.id);
    setUploadOpen(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analyze Request</h1>
        <p className="text-gray-500 text-sm mt-0.5">Paste a client message and instantly know if it's in scope</p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-5">
        {/* Contract selector */}
        <div className="card p-4 space-y-3">
          <div>
            <label className="label">Select Contract</label>
            {contracts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">No contracts yet — upload one first</p>
                <button type="button" onClick={() => setUploadOpen(true)} className="btn-primary text-sm">
                  Upload Contract PDF
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  className="input flex-1"
                  value={selectedId ?? ''}
                  onChange={e => setSelectedId(parseInt(e.target.value))}
                >
                  <option value="">— Choose a contract —</option>
                  {contracts.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="btn-secondary text-sm shrink-0"
                  title="Upload new contract"
                >
                  + New
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Client message */}
        <div className="card p-4">
          <label className="label">Client Message</label>
          <p className="text-xs text-gray-400 mb-2">Paste the exact message from your client</p>
          <textarea
            className="input resize-none"
            rows={6}
            placeholder={`e.g. "Hey, can you also add a dark mode toggle? And while you're at it, could you redesign the mobile nav too?"`}
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Hours at risk (optional) */}
        <div className="card p-4">
          <label className="label">
            Estimated hours this would take{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">Used to calculate revenue protected if out-of-scope</p>
          <div className="flex items-center gap-2 w-36">
            <input
              type="number"
              className="input"
              placeholder="4"
              min="0"
              step="0.5"
              value={hoursAtRisk}
              onChange={e => setHoursAtRisk(e.target.value)}
            />
            <span className="text-sm text-gray-500 shrink-0">hrs</span>
          </div>
        </div>

        {/* Error states */}
        {error === 'upgrade_required' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-amber-800">Free tier limit reached</p>
              <p className="text-xs text-amber-700 mt-0.5">You've used all 5 free analyses. Upgrade to Pro for unlimited.</p>
            </div>
            <Link to="/billing" className="btn-primary shrink-0 text-sm">
              Upgrade $19/mo
            </Link>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
          disabled={loading || !selectedId || !message.trim()}
        >
          {loading ? (
            <>
              <Spinner /> Analyzing…
            </>
          ) : (
            <>⚡ Analyze Scope</>
          )}
        </button>
      </form>

      {/* Result */}
      {result && <AnalysisResult result={result} onCopy={handleCopy} copied={copied} hourlyRate={user?.hourly_rate} />}

      {uploadOpen && (
        <ContractUploadModal onClose={() => setUploadOpen(false)} onUploaded={handleContractUploaded} />
      )}
    </div>
  );
}

function AnalysisResult({ result, onCopy, copied, hourlyRate }) {
  const { verdict, confidence, contract_clause, reasoning, suggested_reply, hours_at_risk } = result;
  const { t } = useTranslation();

  const config = {
    IN_SCOPE:  { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-800',  icon: '✅' },
    OUT_SCOPE: { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-800',    icon: '🚫' },
    AMBIGUOUS: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠️' },
  }[verdict] ?? { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠️' };

  const revenueAtRisk = hours_at_risk && hourlyRate ? hours_at_risk * hourlyRate : null;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Verdict header */}
      <div className={`card p-5 ${config.bg} ${config.border}`}>
        <div className="flex items-start gap-4">
          <span className="text-3xl">{config.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-xl font-bold ${config.text}`}>{t(`verdict_${verdict}`, t('verdict_AMBIGUOUS'))}</h3>
              <span className="text-sm text-gray-500">{t('verdict_confidence')}: {confidence}%</span>
            </div>
            <p className="text-sm text-gray-700">{reasoning}</p>
            {revenueAtRisk > 0 && verdict === 'OUT_SCOPE' && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
                💰 ${revenueAtRisk.toLocaleString()} at risk ({hours_at_risk}h × ${hourlyRate}/hr)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract clause */}
      <div className="card p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          📋 Relevant Contract Clause
        </h4>
        <blockquote className="text-sm text-gray-600 italic border-l-4 border-brand-200 pl-4 py-1 bg-brand-50/30 rounded-r">
          "{contract_clause}"
        </blockquote>
      </div>

      {/* Suggested reply */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            ✉️ Suggested Reply to Client
          </h4>
          <button
            onClick={onCopy}
            className="text-xs btn-secondary py-1 px-2.5 flex items-center gap-1.5"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
        <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap border border-gray-100">
          {suggested_reply}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
