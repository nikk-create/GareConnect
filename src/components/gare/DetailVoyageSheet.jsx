import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Phone, AlertTriangle, TicketCheck, User, Clock, Users } from 'lucide-react';
import BottomSheet from './BottomSheet';
import StatusBadge from './StatusBadge';
import { useGare } from '@/lib/GareContext';

const STATUTS = ['planifie', 'embarquement', 'en_route', 'retard', 'sans_nouvelles', 'arrive'];

export default function DetailVoyageSheet() {
  const { sheetData: voyage, addToast, openSheet, closeSheet } = useGare();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (statut) => base44.entities.Voyage.update(voyage.id, {
      statut, progression: statut === 'arrive' ? 100 : voyage.progression,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voyages'] });
      addToast('Statut mis à jour', 'success');
    },
  });

  if (!voyage) return <BottomSheet name="detail-voyage" title="Voyage" />;

  return (
    <BottomSheet name="detail-voyage" title={`${voyage.origine || 'Cotonou'} → ${voyage.destination}`}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <StatusBadge status={voyage.statut} size="md" />
          <span className="font-mono text-xs text-muted-foreground">{voyage.code_voyage}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> {voyage.heure_depart}</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> {voyage.places_occupees || 0}/{voyage.places_total}</div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2"><User className="w-4 h-4" /> {voyage.chauffeur} {voyage.vehicule && `· ${voyage.vehicule}`}</div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Changer le statut</p>
          <div className="flex flex-wrap gap-2">
            {STATUTS.map((s) => (
              <button
                key={s}
                onClick={() => updateMutation.mutate(s)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors ${
                  voyage.statut === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/30 text-muted-foreground border-border/30'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            to={`/ticket?voyage_id=${voyage.id}`}
            onClick={closeSheet}
            className="flex-1 h-11 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <TicketCheck className="w-4 h-4" /> Vendre ticket
          </Link>
          <button
            onClick={() => openSheet('signaler-incident', voyage)}
            className="flex-1 h-11 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" /> Incident
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
