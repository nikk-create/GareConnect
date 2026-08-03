import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, CheckCircle2, Banknote, AlertTriangle } from 'lucide-react';

const typeConfig = {
  depart: { color: 'bg-primary', label: 'Départ' },
  retard: { color: 'bg-secondary', label: 'Retard' },
  arrivee: { color: 'bg-primary', label: 'Arrivée' },
  sans_nouvelles: { color: 'bg-destructive', label: 'Sans nouvelles' },
  incident: { color: 'bg-destructive', label: 'Incident' },
  sms: { color: 'bg-accent', label: 'SMS' },
};

export default function Alertes() {
  const { data: alertes = [], isLoading } = useQuery({
    queryKey: ['alertes'],
    queryFn: () => base44.entities.Alerte.list('-created_date', 100),
  });

  const totalSms = alertes.length;
  const delivered = alertes.filter(a => a.statut_sms === 'delivre').length;
  const tauxDelivrance = totalSms > 0 ? Math.round((delivered / totalSms) * 100) : 0;
  const totalCout = alertes.reduce((sum, a) => sum + (a.cout_sms || 25), 0);
  const urgents = alertes.filter(a => a.type === 'sans_nouvelles' || a.type === 'incident').length;

  const statCards = [
    { icon: MessageSquare, label: 'SMS envoyés', value: totalSms, color: 'text-accent' },
    { icon: CheckCircle2, label: 'Taux délivrance', value: `${tauxDelivrance}%`, color: 'text-primary' },
    { icon: Banknote, label: 'Coût FCFA', value: totalCout.toLocaleString('fr-FR'), color: 'text-warn' },
    { icon: AlertTriangle, label: 'Urgents', value: urgents, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold font-outfit">Alertes & SMS</h2>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {statCards.map((card, i) => (
          <div key={i} className="flex-shrink-0 w-36 p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm">
            <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
            <p className="text-lg font-extrabold font-outfit">{card.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Journal</h3>
        <div className="space-y-1">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
            ))
          ) : alertes.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">Aucune alerte</p>
          ) : (
            alertes.map((alerte, i) => {
              const config = typeConfig[alerte.type] || typeConfig.sms;
              return (
                <div key={alerte.id} className="flex gap-3 py-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${config.color} flex-shrink-0 mt-0.5`} />
                    {i < alertes.length - 1 && <div className="w-px flex-1 bg-border/50 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{alerte.message}</p>
                      <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
                        {new Date(alerte.created_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.color}/10 font-bold`}>
                        {config.label}
                      </span>
                      {alerte.destinataire && (
                        <span className="text-[10px] text-muted-foreground font-mono">{alerte.destinataire}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
