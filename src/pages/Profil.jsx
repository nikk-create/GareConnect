import React from 'react';
import { LogOut, Shield, User as UserIcon, WifiOff } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useGare } from '@/lib/GareContext';

export default function Profil() {
  const { user, profile, isAdmin, logout } = useAuth();
  const { isOffline, toggleOffline } = useGare() || {};

  return (
    <AppLayout>
      <Header title="Profil" subtitle="Votre compte GareConnect" />
      <div className="px-5 -mt-4 space-y-4 pt-2">
        <Card>
          <CardContent className="py-5 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-ciel/10 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-ciel" />
            </div>
            <div>
              <p className="font-display font-semibold text-encre">{profile?.full_name || 'Utilisateur'}</p>
              <p className="text-xs text-encre/50">{user?.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[11px] text-or mt-1">
                  <Shield className="w-3 h-3" /> Administrateur
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-encre">
              <WifiOff className="w-4 h-4 text-encre/40" /> Mode hors-ligne
            </div>
            <button
              onClick={toggleOffline}
              className={`w-11 h-6 rounded-full relative transition-colors ${isOffline ? 'bg-ciel' : 'bg-encre/15'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isOffline ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full text-red-500 border-red-200" onClick={logout}>
          <LogOut className="w-4 h-4" /> Se déconnecter
        </Button>
      </div>
    </AppLayout>
  );
}
