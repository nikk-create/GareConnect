import React, { useState } from 'react';
import { Phone, AlertTriangle, Users, Clock } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { IncidentSheet } from './IncidentSheet';
import { Voyage } from '@/api/entities';
import { useGare } from '@/lib/GareContext';

const STATUTS = ['planifie', 'embarquement', 'en_route', 'retard', 'sans_nouvelles', 'arrive'];

export function DetailVoyageSheet({ open, onClose, voyage, onUpdated }) {
  const { addToast } = useGare() || {};
  const [showIncident, setShowIncident] = useState(false);
  if (!voyage) return null;

  const changerStatut = async (statut) => {
    try {
      const updated = await Voyage.update(voyage.id, { statut, progression: statut === 'arrive' ? 100 : voyage.progression });
      addToast?.(`Statut mis à jour : ${statut}`);
      onUpdated?.(updated);
    } catch {
      addToast?.('Erreur de mise à jour', 'warn');
    }
  };

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title={voyage.destination}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={voyage.statut} />
            <span className="font-mono text-xs text-encre/40">{voyage.code_voyage}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-encre/60"><Clock className="w-4 h-4" /> {voyage.heure_depart}</div>
            <div className="flex items-center gap-2 text-encre/60"><Users className="w-4 h-4" /> {voyage.places_occupees}/{voyage.places_total} places</div>
            <div className="text-encre/60">Chauffeur: <span className="text-encre font-medium">{voyage.chauffeur}</span></div>
            <div className="text-encre/60">Véhicule: <span className="text-encre font-medium">{voyage.vehicule || '—'}</span></div>
          </div>

          <div>
            <p className="text-xs text-encre/40 mb-2">Changer le statut</p>
            <div className="flex flex-wrap gap-2">
              {STATUTS.map((s) => (
                <button
                  key={s}
                  onClick={() => changerStatut(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${voyage.statut === s ? 'bg-ciel text-white border-ciel' : 'border-encre/10 text-encre/60'}`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:`, '_self')}>
              <Phone className="w-4 h-4" /> Appeler
            </Button>
            <Button variant="destructive" className="flex-1" onClick={() => setShowIncident(true)}>
              <AlertTriangle className="w-4 h-4" /> Incident
            </Button>
          </div>
        </div>
      </BottomSheet>
      <IncidentSheet open={showIncident} onClose={() => setShowIncident(false)} voyage={voyage} />
    </>
  );
}
