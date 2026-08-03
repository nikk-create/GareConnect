import React from 'react';

const statusConfig = {
  planifie: { label: 'Planifié', bg: 'bg-accent/15 text-accent border-accent/30' },
  embarquement: { label: 'Embarquement', bg: 'bg-warn/15 text-warn border-warn/30' },
  en_route: { label: 'En route', bg: 'bg-primary/15 text-primary border-primary/30' },
  retard: { label: 'Retard', bg: 'bg-secondary/15 text-secondary border-secondary/30' },
  sans_nouvelles: { label: 'Sans nouvelles', bg: 'bg-destructive/15 text-destructive border-destructive/30' },
  arrive: { label: 'Arrivé', bg: 'bg-primary/20 text-primary border-primary/40' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.planifie;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-bold font-mono ${config.bg} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-live" />
      {config.label}
    </span>
  );
}
