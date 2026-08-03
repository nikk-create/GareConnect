import React from 'react';

export default function MetricCard({ icon: Icon, label, value, color = 'primary', trend }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    warn: 'bg-warn/10 text-warn border-warn/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const iconBg = {
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    accent: 'bg-accent/15 text-accent',
    warn: 'bg-warn/15 text-warn',
    destructive: 'bg-destructive/15 text-destructive',
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorMap[color]} backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold font-outfit leading-none mb-1">{value}</p>
      <p className="text-xs opacity-70 font-medium">{label}</p>
    </div>
  );
}
