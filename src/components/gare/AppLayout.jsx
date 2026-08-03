import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Header from './Header';
import BottomNav from './BottomNav';
import ToastContainer from './ToastContainer';
import BottomSheet from './BottomSheet';
import NouveauDepartSheet from './NouveauDepartSheet';
import DetailVoyageSheet from './DetailVoyageSheet';
import IncidentSheet from './IncidentSheet';
import SyncQueueSheet from './SyncQueueSheet';
import { useGare } from '@/lib/GareContext';

function AlertesRecentesSheet() {
  const { data: alertes = [] } = useQuery({
    queryKey: ['alertes-recentes'],
    queryFn: () => base44.entities.Alerte.list('-created_date', 10),
  });

  return (
    <BottomSheet name="alertes-recentes" title="Alertes récentes">
      <div className="space-y-2">
        {alertes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune alerte récente.</p>
        ) : (
          alertes.map((a) => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                a.type === 'incident' || a.type === 'sans_nouvelles' ? 'bg-destructive' :
                a.type === 'retard' ? 'bg-secondary' : 'bg-primary'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{a.message}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {a.destinataire || '—'} · {new Date(a.created_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
}

export default function AppLayout({ children }) {
  const { isOffline } = useGare();

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer />
      <Header />
      <main className={`px-4 pb-28 max-w-lg mx-auto ${isOffline ? 'pt-24' : 'pt-[76px]'}`}>
        {children}
      </main>
      <BottomNav />

      <NouveauDepartSheet />
      <DetailVoyageSheet />
      <IncidentSheet />
      <SyncQueueSheet />
      <AlertesRecentesSheet />
    </div>
  );
}
