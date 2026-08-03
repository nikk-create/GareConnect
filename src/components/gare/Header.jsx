import React, { useState } from 'react';
import { Bell, RefreshCw, Bus, User, MoreVertical, Car, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGare } from '@/lib/GareContext';

export default function Header() {
  const { isOffline, toggleOffline, syncQueue, pendingQueue, openSheet } = useGare();
  const [lastTap, setLastTap] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSyncClick = () => {
    const now = Date.now();
    if (now - lastTap < 400) {
      toggleOffline();
    } else if (!isOffline && pendingQueue.length > 0) {
      syncQueue();
    }
    setLastTap(now);
  };

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 text-destructive-foreground text-center py-1.5 text-xs font-semibold safe-top backdrop-blur-sm">
          ⚡ Mode hors-ligne — les données seront synchronisées plus tard
        </div>
      )}
      <header className={`fixed left-0 right-0 z-40 glass border-b border-border/50 safe-top ${isOffline ? 'top-8' : 'top-0'}`}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bus className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold font-outfit tracking-tight text-foreground leading-none">
                GareConnect
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono">Bénin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncClick}
              className="relative w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${!isOffline && pendingQueue.length > 0 ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => openSheet('alertes-recentes')}
              className="relative w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl bg-card border border-border/50 shadow-xl overflow-hidden">
                    <Link to="/gestion-vehicules" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 hover:bg-muted/50 transition-colors text-sm font-medium">
                      <Car className="w-4 h-4 text-primary" /> Flotte véhicules
                    </Link>
                    <Link to="/liste-passagers" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 hover:bg-muted/50 transition-colors text-sm font-medium">
                      <Users className="w-4 h-4 text-accent" /> Liste passagers
                    </Link>
                    <Link to="/profil" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 hover:bg-muted/50 transition-colors text-sm font-medium border-t border-border/30">
                      <User className="w-4 h-4 text-secondary" /> Mon profil
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
