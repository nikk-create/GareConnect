import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-ciel text-white hover:bg-ciel/90',
  primary: 'bg-ciel text-white hover:bg-ciel/90',
  secondary: 'bg-menthe text-encre hover:bg-menthe/90',
  outline: 'border border-encre/20 bg-transparent hover:bg-encre/5 text-encre',
  ghost: 'bg-transparent hover:bg-encre/5 text-encre',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  gold: 'bg-or text-encre hover:bg-or/90',
};
const sizes = { default: 'h-11 px-5 text-sm', sm: 'h-9 px-3 text-sm', lg: 'h-12 px-6 text-base', icon: 'h-10 w-10' };

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
      variants[variant], sizes[size], className
    )}
    {...props}
  />
));
Button.displayName = 'Button';
