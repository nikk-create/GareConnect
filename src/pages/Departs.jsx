import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import VoyageCard from '@/components/gare/VoyageCard';
import { Search } from 'lucide-react';

const filters = [
  { key: 'all', label: 'Tous' },
  { key: 'en_route', label: 'En route' },
  { key: 'embarquement', label: 'Attente' },
  { key: 'arrive', label: 'Arrivés' },
  { key: 'retard', label: 'Retard' },
  { key: 'sans_nouvelles', label: 'Alertes' },
];

export default function Departs() {
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  const { data: voyages = [], isLoading } = useQuery({
    queryKey: ['voyages'],
    queryFn: () => base44.entities.Voyage.list('-created_date', 100),
  });

  const filtered = voyages.filter(v => {
    const matchFilter = active === 'all' || v.statut === active || (active === 'embarquement' && (v.statut === 'embarquement' || v.statut === 'planifie'));
    const matchSearch = !search || v.destination?.toLowerCase().includes(search.toLowerCase()) || v.chauffeur?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold font-outfit">Départs</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher destination, chauffeur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              active === f.key
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {f.label}
            {active === f.key && (
              <span className="ml-1.5 bg-primary-foreground/20 px-1.5 py-0.5 rounded-md text-[10px]">
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/30 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Aucun voyage trouvé
          </div>
        ) : (
          filtered.map(v => <VoyageCard key={v.id} voyage={v} />)
        )}
      </div>
    </div>
  );
}
