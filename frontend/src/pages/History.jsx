import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import VerdictBadge from '../components/VerdictBadge';

export default function History() {
  const { contractId } = useParams();
  const [analyses, setAnalyses] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // analysis id with expanded reply

  useEffect(() => {
    const req = contractId
      ? api.get(`/analysis/contract/${contractId}`)
      : api.get('/analysis');

    Promise.all([api.get('/contracts'), req]).then(([c, a]) => {
      setContracts(c.data.contracts);
      if (contractId) {
        setAnalyses(a.data.analyses);
        setSelectedContract(a.data.contract);
      } else {
        setAnalyses(a.data.analyses);
      }
    }).finally(() => setLoading(false));
  }, [contractId]);

  async function handleFilterChange(id) {
    setLoading(true);
    const url = id ? `/analysis/contract/${id}` : '/analysis';
    const res = await api.get(url);
    setAnalyses(id ? res.data.analyses : res.data.analyses);
    setSelectedContract(id ? res.data.contract : null);
    setLoading(false);
  }

  const outCount = analyses.filter(a => a.verdict === 'OUT_SCOPE').length;
  const totalHours = analyses.reduce((s, a) => s + (a.hours_at_risk || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
            {selectedContract ? ` for "${selectedContract.name}"` : ''}
          </p>
        </div>
        <Link to="/analyze" className="btn-primary text-sm">
          ⚡ New Analysis
        </Link>
      </div>

      {/* Filter + summary */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          className="input w-auto text-sm"
          value={selectedContract?.id ?? ''}
          onChange={e => handleFilterChange(e.target.value || null)}
        >
          <option value="">All contracts</option>
          {contracts.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {outCount > 0 && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
            {outCount} out-of-scope request{outCount > 1 ? 's' : ''} detected
            {totalHours > 0 && ` · ${totalHours}h at risk`}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : analyses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm font-medium text-gray-700">No analyses yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Run your first scope analysis to see results here</p>
          <Link to="/analyze" className="btn-primary text-sm">Analyze a Request</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map(a => (
            <AnalysisCard
              key={a.id}
              analysis={a}
              expanded={expanded === a.id}
              onToggle={() => setExpanded(expanded === a.id ? null : a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnalysisCard({ analysis, expanded, onToggle }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(analysis.suggested_reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card overflow-hidden">
      {/* Summary row — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <VerdictBadge verdict={analysis.verdict} />
          <div className="flex-1 min-w-0">
            {analysis.contract_name && (
              <p className="text-xs text-gray-400 mb-0.5">{analysis.contract_name}</p>
            )}
            <p className="text-sm text-gray-800 line-clamp-2">{analysis.client_message}</p>
          </div>
          <div className="shrink-0 text-right ml-2">
            <p className="text-xs text-gray-400">{fmtDate(analysis.created_at)}</p>
            {analysis.hours_at_risk > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">{analysis.hours_at_risk}h at risk</p>
            )}
          </div>
          <span className="text-gray-300 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
          {/* Full message */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Client Message</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis.client_message}</p>
          </div>

          {/* Reasoning */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">AI Reasoning</p>
            <p className="text-sm text-gray-700">{analysis.reasoning}</p>
          </div>

          {/* Contract clause */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Relevant Clause</p>
            <blockquote className="text-sm text-gray-600 italic border-l-4 border-brand-200 pl-3 py-0.5">
              "{analysis.contract_clause}"
            </blockquote>
          </div>

          {/* Suggested reply */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-500">Suggested Reply</p>
              <button onClick={handleCopy} className="text-xs btn-secondary py-0.5 px-2">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100 whitespace-pre-wrap">
              {analysis.suggested_reply}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}
    </div>
  );
}

function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
