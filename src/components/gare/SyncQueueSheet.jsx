import React from 'react';
import { RefreshCw, Check, Clock } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { Button } from '@/components/ui/button';
import { useGare } from '@/lib/GareContext';

export function SyncQueueSheet({ open, onClose }) {
  const { pendingQueue = [], syncQueue, isOffline } = useGare() || {};

  return (
    <BottomSheet open={open} onClose={onClose} title="File de synchronisation">
      <div className="space-y-3">
        {pendingQueue.length === 0 ? (
          <p className="text-sm text-encre/40 text-center py-8">Rien en attente de synchronisation.</p>
        ) : (
          pendingQueue.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-encre/5">
              <div>
                <p className="text-sm font-medium text-encre">{item.label || item.type}</p>
                <p className="text-xs text-encre/40">{new Date(item.timestamp).toLocaleTimeString('fr-FR')}</p>
              </div>
              {item.status === 'synced'
                ? <Check className="w-4 h-4 text-emerald-600" />
                : <Clock className="w-4 h-4 text-or" />}
            </div>
          ))
        )}
        {pendingQueue.length > 0 && !isOffline && (
          <Button className="w-full" onClick={syncQueue}>
            <RefreshCw className="w-4 h-4" /> Synchroniser maintenant
          </Button>
        )}
      </div>
    </BottomSheet>
  );
}
