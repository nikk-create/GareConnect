import React, { useMemo } from 'react';
import { Route, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Regroupe les voyages du jour par destination pour suggérer
// un ordre de départ optimal (les destinations les plus demandées d'abord).
export function RouteOptimizer({ voyages = [] }) {
  const suggestions = useMemo(() => {
    const parDestination = {};
    for (const v of voyages) {
      if (!parDestination[v.destination]) parDestination[v.destination] = { destination: v.destination, count: 0, places: 0 };
      parDestination[v.destination].count += 1;
      parDestination[v.destination].places += (v.places_occupees || 0);
    }
    return Object.values(parDestination).sort((a, b) => b.places - a.places).slice(0, 5);
  }, [voyages]);

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Route className="w-4 h-4 text-ciel" /> Destinations prioritaires
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {suggestions.map((s, i) => (
          <div key={s.destination} className="flex items-center justify-between text-sm py-1.5">
            <span className="flex items-center gap-2 text-encre">
              <span className="w-5 h-5 rounded-full bg-ciel/10 text-ciel text-[11px] flex items-center justify-center font-semibold">{i + 1}</span>
              {s.destination}
            </span>
            <span className="flex items-center gap-1 text-xs text-encre/50">
              <TrendingUp className="w-3.5 h-3.5" /> {s.places} passagers · {s.count} départs
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
