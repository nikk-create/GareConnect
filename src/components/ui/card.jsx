import React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-2xl border border-encre/10 bg-white shadow-sm', className)} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }) => <div className={cn('p-4 pb-2', className)} {...props} />;
export const CardTitle = ({ className, ...props }) => <h3 className={cn('font-display font-semibold text-encre', className)} {...props} />;
export const CardContent = ({ className, ...props }) => <div className={cn('p-4 pt-2', className)} {...props} />;
