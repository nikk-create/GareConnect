import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-encre/15 bg-white px-3.5 text-sm text-encre placeholder:text-encre/40 focus:outline-none focus:ring-2 focus:ring-ciel/40',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
