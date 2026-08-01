import React from 'react';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }) {
  return <label className={cn('text-sm font-medium text-encre/80 mb-1.5 block', className)} {...props} />;
}
