import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { VoyageCard } from '@/components/gare/VoyageCard';
import { DetailVoyageSheet } from '@/components/gare/DetailVoyageSheet';
import { NouveauDepartSheet } from '@/components/gare/NouveauDepartSheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Voyage } from '@/api/entities';

const FILTRES = [
  { key: 'tous', label: 'Tous' },
  { key: 'planifie', label: 'Planifiés' },
  { key: 'en_route', label: 'En route' },
  { key: 'retard', label: 'Retards' },
  { key: 'arrive', label: 'Arrivés' },
];

export default function Departs() {
  const [voyages, setVoyages] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setVoyages(await Voyage.list('-date_depart', 200)); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = voyages.filter((v) => {
    const matchStatut = filtre === 'tous' || v.statut === filtre;
    const matchSearch = !search || v.destination?.toLowerCase().includes(search.toLowerCase()) || v.chauffeur?.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  return (
    <AppLayout>
      <Header title="Départs" subtitle={`${voyages.length} voyage(s)`} />
      <div className="px-5 -mt-4 space-y-4 pt-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-encre/30" />
          <Input className="pl-10" placeholder="Rechercher une destination, un chauffeur..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
          {FILTRES.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border ${filtre === f.key ? 'bg-encre text-papier border-encre' : 'border-encre/10 text-encre/50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Button className="w-full" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Nouveau départ</Button>

        {loading ? (
          <p className="text-sm text-encre/40 text-center py-8">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-encre/40 text-center py-8">Aucun voyage trouvé.</p>
        ) : (
          <div className="space-y-3 pb-4">
            {filtered.map((v) => <VoyageCard key={v.id} voyage={v} onClick={setSelected} />)}
          </div>
        )}
      </div>

      <DetailVoyageSheet open={!!selected} onClose={() => setSelected(null)} voyage={selected} onUpdated={load} />
      <NouveauDepartSheet open={showNew} onClose={() => setShowNew(false)} onCreated={load} />
    </AppLayout>
  );
}
