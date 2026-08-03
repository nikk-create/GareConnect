import React from 'react';
import { RefreshCw, Check, Clock } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { useGare } from '@/lib/GareContext';

export default function SyncQueueSheet() {
  const { pendingQueue, syncQueue, isOffline } = useGare();

  return (
    <BottomSheet name="sync-queue" title="File de synchronisation">
      <div className="space-y-3">
        {pendingQueue.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Rien en attente de synchronisation.</p>
        ) : (
          pendingQueue.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
              <div>
                <p className="text-sm font-bold capitalize">{item.type}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{new Date(item.timestamp).toLocaleTimeString('fr-FR')}</p>
              </div>
              {item.status === 'synced'
                ? <Check className="w-4 h-4 text-primary" />
                : <Clock className="w-4 h-4 text-warn" />}
            </div>
          ))
        )}
        {pendingQueue.length > 0 && !isOffline && (
          <button
            onClick={syncQueue}
            className="w-full h-11 rounded-2xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Synchroniser maintenant
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
