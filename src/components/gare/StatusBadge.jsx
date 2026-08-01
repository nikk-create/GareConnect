import React from 'react';
import { Badge } from '@/components/ui/badge';

const CONFIG = {
  planifie:        { label: 'Planifié',        variant: 'muted' },
  embarquement:     { label: 'Embarquement',    variant: 'default' },
  en_route:        { label: 'En route',         variant: 'success' },
  retard:          { label: 'Retard',           variant: 'warning' },
  sans_nouvelles:  { label: 'Sans nouvelles',   variant: 'danger' },
  arrive:          { label: 'Arrivé',           variant: 'success' },
  actif:           { label: 'Actif',            variant: 'success' },
  maintenance:     { label: 'Maintenance',      variant: 'warning' },
  hors_service:    { label: 'Hors service',     variant: 'danger' },
  ouvert:          { label: 'Ouvert',           variant: 'danger' },
  en_cours:        { label: 'En cours',         variant: 'warning' },
  resolu:          { label: 'Résolu',           variant: 'success' },
};

export function StatusBadge({ status, className }) {
  const cfg = CONFIG[status] || { label: status, variant: 'muted' };
  return <Badge variant={cfg.variant} className={className}>{cfg.label}</Badge>;
}
