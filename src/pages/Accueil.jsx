import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Bus, Users, Banknote, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricCard from '@/components/gare/MetricCard';
import VoyageCard from '@/components/gare/VoyageCard';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="font-mono text-sm text-muted-foreground">
      {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export default function Accueil() {
  const { data: voyages = [] } = useQuery({
    queryKey: ['voyages'],
    queryFn: () => base44.entities.Voyage.list('-created_date', 50),
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date', 100),
  });
  const { data: alertes = [] } = useQuery({
    queryKey: ['alertes'],
    queryFn: () => base44.entities.Alerte.list('-created_date', 20),
  });

  const enRoute = voyages.filter(v => v.statut === 'en_route' || v.statut === 'embarquement');
  const totalPassagers = tickets.length;
  const totalRecettes = tickets.reduce((sum, t) => sum + (t.montant || 0), 0);
  const incidents = voyages.filter(v => v.statut === 'sans_nouvelles' || v.statut === 'retard');

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold font-outfit">Tableau de bord</h2>
          <LiveClock />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
          Gare Dantokpa
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={Bus} label="Voyages" value={voyages.length} color="primary" trend="+12%" />
        <MetricCard icon={Users} label="Passagers" value={totalPassagers} color="accent" />
        <MetricCard icon={Banknote} label="Recettes FCFA" value={totalRecettes.toLocaleString('fr-FR')} color="warn" />
        <MetricCard icon={AlertTriangle} label="Incidents" value={incidents.length} color="destructive" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold font-outfit">Voyages en cours</h3>
          <Link to="/departs" className="text-xs text-primary font-semibold flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {enRoute.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucun voyage en cours
            </div>
          )}
          {enRoute.slice(0, 5).map(v => (
            <VoyageCard key={v.id} voyage={v} />
          ))}
        </div>
      </div>

      {incidents.length > 0 && (
        <Link to="/incidents" className="flex items-center justify-between p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/15 transition-colors">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-sm font-bold text-destructive">{incidents.length} incident(s) actif(s)</p>
              <p className="text-[10px] text-muted-foreground">Voir le module de gestion</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-destructive" />
        </Link>
      )}

      <div>
        <h3 className="text-base font-bold font-outfit mb-3">Alertes SMS récentes</h3>
        <div className="space-y-2">
          {alertes.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                a.type === 'depart' ? 'bg-primary' :
                a.type === 'retard' ? 'bg-secondary' :
                a.type === 'arrivee' ? 'bg-primary' :
                a.type === 'sans_nouvelles' ? 'bg-destructive' : 'bg-accent'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{a.message}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {a.destinataire || '—'} · {new Date(a.created_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {alertes.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">Aucune alerte</p>
          )}
        </div>
      </div>
    </div>
  );
}
