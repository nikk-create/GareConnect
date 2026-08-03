import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Bus, Users, Banknote, TrendingUp, FileDown, FileSpreadsheet } from 'lucide-react';
import MetricCard from '@/components/gare/MetricCard';
import { useGare } from '@/lib/GareContext';

const destinations = [
  { name: 'Parakou', pct: 32 },
  { name: 'Porto-Novo', pct: 24 },
  { name: 'Abomey', pct: 18 },
  { name: 'Natitingou', pct: 15 },
  { name: 'Lokossa', pct: 11 },
];

export default function Stats() {
  const { addToast } = useGare();

  const { data: voyages = [] } = useQuery({
    queryKey: ['voyages'],
    queryFn: () => base44.entities.Voyage.list('-created_date', 200),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date', 500),
  });

  const totalRecettes = tickets.reduce((sum, t) => sum + (t.montant || 0), 0);
  const mtnCount = tickets.filter(t => t.moyen_paiement === 'mtn_momo').length;
  const moovCount = tickets.filter(t => t.moyen_paiement === 'moov_money').length;
  const cashCount = tickets.filter(t => t.moyen_paiement === 'especes').length;
  const totalPay = mtnCount + moovCount + cashCount || 1;

  const payData = [
    { label: 'MTN MoMo', pct: Math.round((mtnCount / totalPay) * 100), color: 'bg-warn' },
    { label: 'Moov Money', pct: Math.round((moovCount / totalPay) * 100), color: 'bg-accent' },
    { label: 'Espèces', pct: Math.round((cashCount / totalPay) * 100), color: 'bg-primary' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold font-outfit">Statistiques</h2>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={Bus} label="Voyages ce mois" value={voyages.length} color="primary" />
        <MetricCard icon={Users} label="Passagers" value={tickets.length} color="accent" />
        <MetricCard icon={Banknote} label="Recettes FCFA" value={totalRecettes.toLocaleString('fr-FR')} color="warn" />
        <MetricCard icon={TrendingUp} label="Moy./voyage" value={voyages.length > 0 ? Math.round(totalRecettes / voyages.length).toLocaleString('fr-FR') : '0'} color="secondary" />
      </div>

      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Top destinations</h3>
        <div className="space-y-3">
          {destinations.map((dest, i) => (
            <div key={dest.name} className="flex items-center gap-3">
              <span className="text-xs font-bold w-24 text-right">{dest.name}</span>
              <div className="flex-1 h-6 bg-muted/30 rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded-lg flex items-center px-2 transition-all duration-700 ${
                    i === 0 ? 'bg-primary/60' : i === 1 ? 'bg-accent/60' : i === 2 ? 'bg-secondary/60' : i === 3 ? 'bg-warn/60' : 'bg-muted-foreground/30'
                  }`}
                  style={{ width: `${dest.pct}%` }}
                >
                  <span className="text-[10px] font-bold font-mono">{dest.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Répartition paiements</h3>
        <div className="flex gap-3">
          {payData.map(p => (
            <div key={p.label} className="flex-1 text-center p-4 rounded-2xl bg-card/60 border border-border/50">
              <p className="text-2xl font-extrabold font-outfit">{p.pct}%</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">{p.label}</p>
              <div className={`h-1.5 ${p.color} rounded-full mt-2 mx-auto`} style={{ width: `${Math.max(p.pct, 10)}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => addToast('Export PDF en cours...', 'success')}
          className="flex-1 h-12 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <FileDown className="w-4 h-4" /> Export PDF
        </button>
        <button
          onClick={() => addToast('Export Excel en cours...', 'success')}
          className="flex-1 h-12 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
      </div>
    </div>
  );
}
