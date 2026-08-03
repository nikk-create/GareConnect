import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Navigation, Map, Bell, AlertTriangle, Plus } from 'lucide-react';
import { useGare } from '@/lib/GareContext';

const tabs = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/departs', icon: Navigation, label: 'Départs' },
  { path: '/carte', icon: Map, label: 'Carte' },
  { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { path: '/alertes', icon: Bell, label: 'Alertes' },
];

export default function BottomNav() {
  const location = useLocation();
  const { pendingQueue, openSheet } = useGare();
  const pendingCount = pendingQueue.filter(p => p.status === 'pending').length;

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => openSheet('nouveau-depart')}
        className="fixed z-30 right-4 bottom-24 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform hover:shadow-primary/50 hover:shadow-xl"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Pending badge */}
      {pendingCount > 0 && (
        <div className="fixed z-30 left-1/2 -translate-x-1/2 bottom-[88px] px-3 py-1.5 rounded-full bg-warn/90 text-black text-xs font-bold shadow-lg animate-bounce">
          {pendingCount} en attente de sync
        </div>
      )}

      {/* Nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-xl transition-all ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
