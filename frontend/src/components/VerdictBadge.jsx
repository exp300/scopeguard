import React from 'react';

const CONFIG = {
  IN_SCOPE:  { label: 'In Scope',    bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  OUT_SCOPE: { label: 'Out of Scope', bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  AMBIGUOUS: { label: 'Ambiguous',   bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
};

export default function VerdictBadge({ verdict, size = 'sm' }) {
  const c = CONFIG[verdict] ?? CONFIG.AMBIGUOUS;
  const textSize = size === 'xs' ? 'text-xs' : 'text-xs';
  const padding = size === 'xs' ? 'px-1.5 py-0.5' : 'px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full shrink-0 ${c.bg} ${c.text} ${textSize} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}
