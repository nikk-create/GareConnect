import React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-24 w-full rounded-xl border border-encre/15 bg-white px-3.5 py-2.5 text-sm text-encre placeholder:text-encre/40 focus:outline-none focus:ring-2 focus:ring-ciel/40',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
