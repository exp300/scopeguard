import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import ContractUploadModal from '../components/ContractUploadModal';
import VerdictBadge from '../components/VerdictBadge';

import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Persistence helpers ──────────────────────────────────────────────────

const DEFAULT_ORDER = ['revenue', 'analyses', 'outscope', 'contracts'];
const DEFAULT_SIZES = { revenue: 'md', analyses: 'sm', outscope: 'sm', contracts: 'sm' };
const LS_ORDER = 'sg_dash_order';
const LS_SIZES = 'sg_dash_sizes';

function loadOrder() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_ORDER));
    if (Array.isArray(v) && v.length === 4) return v;
  } catch {}
  return DEFAULT_ORDER;
}

function loadSizes() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_SIZES));
    if (v && typeof v === 'object') return { ...DEFAULT_SIZES, ...v };
  } catch {}
  return { ...DEFAULT_SIZES };
}

// ─── Card metadata ────────────────────────────────────────────────────────

function getCardMeta(id, stats, contracts) {
  switch (id) {
    case 'revenue':   return { label: 'Revenue Protected', value: `$${(stats?.revenue_protected || 0).toLocaleString()}`, sub: 'based on your hourly rate', highlight: true };
    case 'analyses':  return { label: 'Analyses Run',       value: stats?.total_analyses ?? 0,    sub: 'all time' };
    case 'outscope':  return { label: 'Out-of-Scope Caught', value: stats?.out_of_scope_count ?? 0, sub: 'requests blocked', color: 'red' };
    case 'contracts': return { label: 'Contracts',           value: contracts?.length ?? 0,        sub: 'active projects' };
    default: return {};
  }
}

const SIZE_CYCLE = { sm: 'md', md: 'lg', lg: 'sm' };
const SIZE_LABEL = { sm: 'Small', md: 'Medium', lg: 'Large' };

const COL_SPAN = {
  sm: 'col-span-1',
  md: 'col-span-2',
  lg: 'col-span-2 lg:col-span-4',
};

// ─── Main page ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cardOrder, setCardOrder] = useState(loadOrder);
  const [cardSizes, setCardSizes] = useState(loadSizes);
  const [activeId, setActiveId] = useState(null);

  // Persist order + sizes
  useEffect(() => { localStorage.setItem(LS_ORDER, JSON.stringify(cardOrder)); }, [cardOrder]);
  useEffect(() => { localStorage.setItem(LS_SIZES, JSON.stringify(cardSizes)); }, [cardSizes]);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setCardOrder(prev => {
      const from = prev.indexOf(active.id);
      const to   = prev.indexOf(over.id);
      return arrayMove(prev, from, to);
    });
  }

  const cycleSize = useCallback((id) => {
    setCardSizes(prev => ({ ...prev, [id]: SIZE_CYCLE[prev[id]] }));
  }, []);

  function resetLayout() {
    setCardOrder([...DEFAULT_ORDER]);
    setCardSizes({ ...DEFAULT_SIZES });
  }

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

  const activeMeta = activeId ? getCardMeta(activeId, stats, contracts) : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetLayout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 rounded hover:bg-gray-100"
            title="Reset card layout to default"
          >
            Reset layout
          </button>
          <button onClick={() => setUploadOpen(true)} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Upload Contract
          </button>
        </div>
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

      {/* Draggable stat cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cardOrder.map(id => (
              <SortableStatCard
                key={id}
                id={id}
                size={cardSizes[id]}
                onCycleSize={() => cycleSize(id)}
                meta={getCardMeta(id, stats, contracts)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeMeta && (
            <StatCard
              {...activeMeta}
              size={cardSizes[activeId]}
              overlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Hourly rate nudge */}
      {!user?.hourly_rate && (
        <HourlyRatePrompt onUpdated={refreshUser} />
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Contracts list */}
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
                    <button onClick={() => navigate(`/analyze/${c.id}`)} className="text-xs btn-secondary py-1 px-2.5">
                      Analyze
                    </button>
                    <button onClick={() => handleDeleteContract(c.id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete">
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent analyses */}
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

// ─── Sortable wrapper ─────────────────────────────────────────────────────

function SortableStatCard({ id, size, onCycleSize, meta }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${COL_SPAN[size]} ${isDragging ? 'opacity-30' : ''}`}
    >
      <StatCard
        {...meta}
        size={size}
        onCycleSize={onCycleSize}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, highlight, color, size, onCycleSize, dragHandleProps, overlay }) {
  return (
    <div className={`
      card p-4 relative group select-none h-full
      ${highlight ? 'bg-brand-50 border-brand-100' : ''}
      ${overlay ? 'shadow-xl rotate-1 cursor-grabbing' : ''}
    `}>
      {/* Drag handle — top-left grip, only when not overlay */}
      {!overlay && dragHandleProps && (
        <button
          {...dragHandleProps}
          className="absolute top-2 left-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
          title="Drag to reorder"
          tabIndex={-1}
        >
          <GripIcon />
        </button>
      )}

      {/* Resize button — top-right, cycles sm→md→lg */}
      {!overlay && onCycleSize && (
        <button
          onClick={onCycleSize}
          className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500"
          title={`Size: ${SIZE_LABEL[size]} — click to change`}
        >
          <ResizeIcon size={size} />
        </button>
      )}

      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide pt-1">{label}</p>
      <p className={`font-bold mt-1 ${
        size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl'
      } ${highlight ? 'text-brand-600' : color === 'red' ? 'text-red-500' : 'text-gray-900'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <circle cx="3" cy="3" r="1.2"/><circle cx="9" cy="3" r="1.2"/>
      <circle cx="3" cy="6" r="1.2"/><circle cx="9" cy="6" r="1.2"/>
      <circle cx="3" cy="9" r="1.2"/><circle cx="9" cy="9" r="1.2"/>
    </svg>
  );
}

function ResizeIcon({ size }) {
  // Shows different icon based on current size to hint what it does
  const icons = {
    sm: ( // expand →
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M1 6h10M8 3l3 3-3 3"/>
      </svg>
    ),
    md: ( // expand more
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M1 3h10M1 9h10M8 5.5L11 3 8 .5"/>
      </svg>
    ),
    lg: ( // shrink ←
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M11 6H1M4 3L1 6l3 3"/>
      </svg>
    ),
  };
  return icons[size] || icons.sm;
}

// ─── Other components (unchanged) ─────────────────────────────────────────

function EmptyContracts({ onUpload }) {
  return (
    <div className="text-center py-8">
      <p className="text-3xl mb-2">📋</p>
      <p className="text-sm font-medium text-gray-700">No contracts yet</p>
      <p className="text-xs text-gray-400 mt-1 mb-4">Upload a PDF contract to get started</p>
      <button onClick={onUpload} className="btn-primary text-sm">Upload your first contract</button>
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
        <input type="number" className="input w-20 text-sm" placeholder="150" value={rate} onChange={e => setRate(e.target.value)} min="0" />
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
