import React from 'react';
import { MapPin, User, Clock, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useGare } from '@/lib/GareContext';

export default function VoyageCard({ voyage }) {
  const { openSheet } = useGare();
  const placesRestantes = (voyage.places_total || 0) - (voyage.places_occupees || 0);

  return (
    <div
      onClick={() => openSheet('detail-voyage', voyage)}
      className="group rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">
              {voyage.origine || 'Cotonou'} → {voyage.destination}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono">
              {voyage.code_voyage || 'GC-' + (voyage.id?.slice(-4) || '0000')}
            </p>
          </div>
        </div>
        <StatusBadge status={voyage.statut} />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" /> {voyage.chauffeur}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {voyage.places_occupees || 0}/{voyage.places_total}
        </span>
        <span className="flex items-center gap-1 font-mono font-bold text-foreground">
          <Clock className="w-3 h-3 text-muted-foreground" /> {voyage.heure_depart}
        </span>
      </div>

      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${voyage.progression || 0}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{voyage.progression || 0}% du trajet</span>
        <span className="text-[10px] font-mono font-bold text-primary">{placesRestantes} places</span>
      </div>
    </div>
  );
}
