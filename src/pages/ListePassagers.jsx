import React, { useEffect, useState } from 'react';
import { Search, Phone, Users } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Ticket, Voyage } from '@/api/entities';
import { formatFCFA } from '@/lib/utils';

export default function ListePassagers() {
  const [tickets, setTickets] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [search, setSearch] = useState('');
  const [voyageFiltre, setVoyageFiltre] = useState('tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [t, v] = await Promise.all([Ticket.list('-created_at', 300), Voyage.list('-date_depart', 100)]);
        setTickets(t); setVoyages(v);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = tickets.filter((t) => {
    const matchVoyage = voyageFiltre === 'tous' || t.voyage_id === voyageFiltre;
    const q = search.toLowerCase();
    const matchSearch = !search || `${t.passager_prenom} ${t.passager_nom}`.toLowerCase().includes(q) || t.passager_telephone?.includes(search) || t.code_ticket?.toLowerCase().includes(q);
    return matchVoyage && matchSearch;
  });

  return (
    <AppLayout>
      <Header title="Passagers" subtitle={`${tickets.length} ticket(s) vendu(s)`} />
      <div className="px-5 -mt-4 space-y-4 pt-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-encre/30" />
          <Input className="pl-10" placeholder="Nom, téléphone ou code ticket..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <select
          className="w-full h-11 rounded-xl border border-encre/15 bg-white px-3.5 text-sm text-encre"
          value={voyageFiltre}
          onChange={(e) => setVoyageFiltre(e.target.value)}
        >
          <option value="tous">Tous les voyages</option>
          {voyages.map((v) => <option key={v.id} value={v.id}>{v.destination} · {v.heure_depart}</option>)}
        </select>

        {loading ? (
          <p className="text-sm text-encre/40 text-center py-8">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-8 h-8 text-encre/20 mx-auto mb-2" />
            <p className="text-sm text-encre/40">Aucun passager trouvé.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <Card key={t.id}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-encre">{t.passager_prenom} {t.passager_nom}</p>
                    <p className="text-xs text-encre/50">{t.destination} · {formatFCFA(t.montant)} · {t.code_ticket}</p>
                  </div>
                  <a href={`tel:${t.passager_telephone}`} className="w-9 h-9 rounded-full bg-menthe/15 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-emerald-700" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
