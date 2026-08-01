import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bus, AlertTriangle, Bell, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/departs', icon: Bus, label: 'Départs' },
  { to: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { to: '/alertes', icon: Bell, label: 'Alertes' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-encre/5 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors',
              isActive ? 'text-ciel' : 'text-encre/40'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
