import React from 'react';
import { useTranslation } from 'react-i18next';

const STYLE = {
  IN_SCOPE:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  OUT_SCOPE: { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  AMBIGUOUS: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
};

export default function VerdictBadge({ verdict, size = 'sm' }) {
  const { t } = useTranslation();
  const s = STYLE[verdict] ?? STYLE.AMBIGUOUS;
  const padding = size === 'xs' ? 'px-1.5 py-0.5' : 'px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full shrink-0 ${s.bg} ${s.text} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {t(`verdict_${verdict}`, t('verdict_AMBIGUOUS'))}
    </span>
  );
}
