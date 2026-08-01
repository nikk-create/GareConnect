import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useGare } from '@/lib/GareContext';
import logo from '@/assets/logo.png';

export function Header({ title, subtitle, action }) {
  const { isOffline, toggleOffline } = useGare() || {};
  return (
    <header className="sticky top-0 z-30 bg-encre text-papier px-5 pt-5 pb-4 rounded-b-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="w-9 h-9 rounded-xl shrink-0" />
          <div>
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-papier/50 text-xs mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            onClick={toggleOffline}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${isOffline ? 'bg-red-500/20 text-red-300' : 'bg-menthe/15 text-menthe'}`}
            title={isOffline ? 'Hors-ligne' : 'En ligne'}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
