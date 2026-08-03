import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Users, Phone, MapPin, Search, CreditCard, Calendar } from 'lucide-react';
import moment from 'moment';

const paiementLabel = { mtn_momo: 'MTN MoMo', moov_money: 'Moov Money', especes: 'Espèces' };
const paiementColor = { mtn_momo: 'text-warn bg-warn/10 border-warn/30', moov_money: 'text-accent bg-accent/10 border-accent/30', especes: 'text-primary bg-primary/10 border-primary/30' };

export default function ListePassagers() {
  const [search, setSearch] = useState('');
  const [filterPaiement, setFilterPaiement] = useState('all');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets-passagers'],
    queryFn: () => base44.entities.Ticket.list('-created_date', 200),
  });

  const { data: voyages = [] } = useQuery({
    queryKey: ['voyages-ref'],
    queryFn: () => base44.entities.Voyage.list('-created_date', 100),
  });

  const voyageMap = voyages.reduce((m, v) => { m[v.id] = v; return m; }, {});

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || [t.passager_prenom, t.passager_nom, t.passager_telephone, t.destination]
      .some(f => f?.toLowerCase().includes(q));
    const matchPaiement = filterPaiement === 'all' || t.moyen_paiement === filterPaiement;
    return matchSearch && matchPaiement;
  });

  const totalRevenu = filtered.reduce((s, t) => s + (t.montant || 0), 0);
  const withContacts = filtered.filter(t => t.contacts_famille?.length > 0).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold font-outfit">Passagers</h2>
        <p className="text-xs text-muted-foreground">Tous les passagers enregistrés</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20 text-center">
          <p className="text-2xl font-extrabold text-accent">{tickets.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Total billets</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-xl font-extrabold text-primary leading-tight">{(totalRevenu / 1000).toFixed(1)}k</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">FCFA</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 text-center">
          <p className="text-2xl font-extrabold text-secondary">{withContacts}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Avec contacts</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un passager..."
          className="w-full h-11 pl-9 pr-4 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'Tous' },
          { key: 'mtn_momo', label: 'MTN MoMo' },
          { key: 'moov_money', label: 'Moov Money' },
          { key: 'especes', label: 'Espèces' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterPaiement(f.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterPaiement === f.key ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground font-medium">{filtered.length} passager{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-muted/30 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground text-sm">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Aucun passager trouvé
          </div>
        ) : (
          filtered.map(ticket => {
            const voyage = voyageMap[ticket.voyage_id];
            return (
              <div key={ticket.id} className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-muted-foreground">
                        {(ticket.passager_prenom?.[0] || '') + (ticket.passager_nom?.[0] || '')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold truncate">{ticket.passager_prenom} {ticket.passager_nom}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs text-muted-foreground font-mono">{ticket.passager_telephone}</p>
                      </div>
                    </div>
                  </div>
                  {ticket.moyen_paiement && (
                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border ${paiementColor[ticket.moyen_paiement] || 'bg-muted text-muted-foreground'}`}>
                      {paiementLabel[ticket.moyen_paiement] || ticket.moyen_paiement}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{ticket.destination || voyage?.destination || '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>{ticket.date_depart ? moment(ticket.date_depart).format('DD/MM/YY') : (voyage?.date_depart ? moment(voyage.date_depart).format('DD/MM/YY') : '—')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CreditCard className="w-3 h-3 flex-shrink-0" />
                    <span className="font-bold text-foreground">{ticket.montant?.toLocaleString()} FCFA</span>
                  </div>
                  {ticket.code_ticket && (
                    <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                      <span className="truncate">{ticket.code_ticket}</span>
                    </div>
                  )}
                </div>

                {ticket.contacts_famille?.length > 0 && (
                  <div className="pt-2 border-t border-border/20">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Contacts famille ({ticket.contacts_famille.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ticket.contacts_famille.map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-muted/40 border border-border/30 text-muted-foreground">
                          {c.nom} {c.relation ? `(${c.relation})` : ''} · {c.telephone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
