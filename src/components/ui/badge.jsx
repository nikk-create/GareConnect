import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-ciel/10 text-ciel',
  success: 'bg-menthe/20 text-emerald-700',
  warning: 'bg-or/20 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  muted: 'bg-encre/5 text-encre/60',
};

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)}
      {...props}
    />
  );
}
