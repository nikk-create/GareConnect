import React from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';

export function VoyageCard({ voyage, onClick }) {
  const tauxRemplissage = voyage.places_total
    ? Math.round((voyage.places_occupees / voyage.places_total) * 100)
    : 0;

  return (
    <Card className="cursor-pointer active:scale-[0.98] transition-transform" onClick={() => onClick?.(voyage)}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5 text-encre">
            <MapPin className="w-4 h-4 text-ciel" />
            <span className="font-display font-semibold">{voyage.destination}</span>
          </div>
          <StatusBadge status={voyage.statut} />
        </div>
        <div className="flex items-center gap-4 text-xs text-encre/50 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {voyage.heure_depart}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {voyage.places_occupees}/{voyage.places_total}</span>
          {voyage.code_voyage && <span className="font-mono">{voyage.code_voyage}</span>}
        </div>
        <div className="h-1.5 bg-encre/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-ciel rounded-full transition-all"
            style={{ width: `${voyage.statut === 'arrive' ? 100 : voyage.progression || 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-encre/40">
          <span>{voyage.chauffeur}</span>
          <span>{tauxRemplissage}% rempli</span>
        </div>
      </CardContent>
    </Card>
  );
}
