import React, { useMemo } from 'react';
import { Route, TrendingUp, AlertTriangle } from 'lucide-react';

// Estimation simple du temps restant avant arrivée, basée sur la progression.
// Durée moyenne de trajet supposée à 180 min, ajustée si le voyage est en retard.
export function computeETA(voyage) {
  const DUREE_MOYENNE_MIN = 180;
  const progression = voyage.progression || 0;
  if (voyage.statut === 'arrive') return 0;
  let remaining = Math.round(((100 - progression) / 100) * DUREE_MOYENNE_MIN);
  if (voyage.statut === 'retard') remaining += 30;
  if (voyage.statut === 'sans_nouvelles') remaining += 60;
  return Math.max(remaining, 0);
}

export default function RouteOptimizer({ voyages = [], incidents = [] }) {
  const suggestions = useMemo(() => {
    const parDestination = {};
    for (const v of voyages) {
      if (v.statut === 'arrive') continue;
      if (!parDestination[v.destination]) {
        parDestination[v.destination] = { destination: v.destination, count: 0, places: 0, hasIncident: false };
      }
      parDestination[v.destination].count += 1;
      parDestination[v.destination].places += voyage_places(v);
      if (incidents.some((i) => i.voyage_id === v.id && i.statut_resolution !== 'resolu')) {
        parDestination[v.destination].hasIncident = true;
      }
    }
    function voyage_places(v) { return v.places_occupees || 0; }
    return Object.values(parDestination).sort((a, b) => b.places - a.places).slice(0, 5);
  }, [voyages, incidents]);

  if (suggestions.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">Aucun trajet actif à optimiser.</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Route className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold font-outfit">Destinations prioritaires</h3>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={s.destination} className="flex items-center justify-between text-sm py-1.5">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {s.destination}
              {s.hasIncident && <AlertTriangle className="w-3 h-3 text-destructive" />}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> {s.places} pax · {s.count} départ(s)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
