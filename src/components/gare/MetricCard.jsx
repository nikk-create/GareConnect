import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function MetricCard({ icon: Icon, label, value, sublabel, accent = 'ciel', onClick }) {
  const accentClasses = {
    ciel: 'bg-ciel/10 text-ciel',
    menthe: 'bg-menthe/20 text-emerald-700',
    or: 'bg-or/20 text-amber-700',
    danger: 'bg-red-100 text-red-600',
  };
  return (
    <Card
      className={cn('cursor-pointer hover:shadow-md transition-shadow', onClick && 'active:scale-[0.98]')}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 py-4">
        {Icon && (
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', accentClasses[accent])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-2xl font-display font-semibold text-encre leading-tight">{value}</p>
          <p className="text-xs text-encre/50 truncate">{label}</p>
          {sublabel && <p className="text-[11px] text-encre/40 mt-0.5">{sublabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
