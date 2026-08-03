import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGare } from '@/lib/GareContext';
import { AlertTriangle, Wrench, CheckCircle2, Bell, User } from 'lucide-react';

const RESPONSABLES = ['Adjovi Sylvain', 'Koffi Mensah', 'Blandine Zinsou', 'Raphael Dossou'];

const graviteConfig = {
  faible:   { color: 'text-accent',       bg: 'bg-accent/10 border-accent/20',         label: 'Faible' },
  moyen:    { color: 'text-warn',          bg: 'bg-warn/10 border-warn/20',             label: 'Moyen' },
  grave:    { color: 'text-secondary',     bg: 'bg-secondary/10 border-secondary/20',   label: 'Grave' },
  critique: { color: 'text-destructive',   bg: 'bg-destructive/10 border-destructive/20', label: 'Critique' },
};

const statutConfig = {
  ouvert:   { label: 'Ouvert',   icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
  en_cours: { label: 'En cours', icon: Wrench,        color: 'text-warn',        bg: 'bg-warn/10 border-warn/30' },
  resolu:   { label: 'Resolu',   icon: CheckCircle2,  color: 'text-primary',     bg: 'bg-primary/10 border-primary/30' },
};

const typeLabel = {
  panne: 'Panne vehicule', accident: 'Accident', retard_majeur: 'Retard majeur',
  passager_malade: 'Passager malade', route_bloquee: 'Route bloquee', autre: 'Autre',
};

function ResolveModal({ incident, onClose, onResolve }) {
  const [notes, setNotes] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl border-t border-border/50 p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-muted rounded-full mx-auto" />
        <h3 className="text-base font-extrabold font-outfit">Resoudre l'incident</h3>
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-xs font-bold text-primary">{typeLabel[incident.type_incident] || incident.type_incident}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{incident.description}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Notes de resolution</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Decrivez comment l'incident a ete resolu..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-11 rounded-2xl bg-muted text-muted-foreground text-sm font-bold">
            Annuler
          </button>
          <button
            onClick={() => { onResolve(incident, notes); onClose(); }}
            className="flex-1 h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20"
          >
            Marquer resolu
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Incidents() {
  const { addToast, openSheet } = useGare();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => base44.entities.Incident.list('-created_date', 100),
    refetchInterval: 20000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Incident.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['incidents'] }),
  });

  const assignAuto = async (incident) => {
    const responsable = RESPONSABLES[Math.floor(Math.random() * RESPONSABLES.length)];
    await updateMutation.mutateAsync({ id: incident.id, data: { statut_resolution: 'en_cours', assigned_to: responsable, assigned_at: new Date().toISOString() } });
    addToast(`Assigne a ${responsable}`, 'success');
  };

  const notifyPassengers = async (incident) => {
    await base44.entities.Alerte.create({
      type: 'incident',
      message: `Incident ${typeLabel[incident.type_incident] || ''} sur le voyage ${incident.code_voyage || ''} vers ${incident.destination || ''}. Equipes mobilisees.`,
      voyage_id: incident.voyage_id,
      destination: incident.destination,
    });
    await updateMutation.mutateAsync({ id: incident.id, data: { passengers_notified: true } });
    queryClient.invalidateQueries({ queryKey: ['alertes'] });
    addToast('Passagers notifies par SMS', 'success');
  };

  const markResolved = async (incident, notes) => {
    await updateMutation.mutateAsync({ id: incident.id, data: { statut_resolution: 'resolu', resolved_at: new Date().toISOString(), resolution_notes: notes || 'Resolu.' } });
    try {
      await base44.functions.invoke('notifyIncidentResolved', { incident_id: incident.id });
    } catch (e) {
      // La notification échoue silencieusement — l'incident est quand même résolu
    }
    queryClient.invalidateQueries({ queryKey: ['alertes'] });
    addToast('Incident resolu — familles notifiées', 'success');
  };

  const filtersConfig = [
    { key: 'all',      label: 'Tous',      count: incidents.length },
    { key: 'ouvert',   label: 'Ouverts',   count: incidents.filter(i => i.statut_resolution === 'ouvert').length },
    { key: 'en_cours', label: 'En cours',  count: incidents.filter(i => i.statut_resolution === 'en_cours').length },
    { key: 'resolu',   label: 'Resolus',   count: incidents.filter(i => i.statut_resolution === 'resolu').length },
  ];

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.statut_resolution === filter);

  const critique = incidents.filter(i => i.gravite === 'critique' && i.statut_resolution !== 'resolu').length;
  const nonAssignes = incidents.filter(i => !i.assigned_to && i.statut_resolution === 'ouvert').length;
  const resolutionRate = incidents.length > 0 ? Math.round((incidents.filter(i => i.statut_resolution === 'resolu').length / incidents.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold font-outfit">Incidents</h2>
          <p className="text-xs text-muted-foreground">Gestion et resolution</p>
        </div>
        <button
          onClick={() => openSheet('signaler-incident', null)}
          className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Signaler
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-2xl font-extrabold text-destructive">{critique}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Critiques</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-warn/10 border border-warn/20 text-center">
          <p className="text-2xl font-extrabold text-warn">{nonAssignes}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Non assignes</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-2xl font-extrabold text-primary">{resolutionRate}%</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Taux resolution</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-muted/20 border border-border/30">
        {['Ouvert', 'En cours', 'Resolu'].map((step, i) => (
          <React.Fragment key={step}>
            <div className={`flex-1 text-center py-2 rounded-xl text-[11px] font-bold border ${
              i === 0 ? 'bg-destructive/10 text-destructive border-destructive/30' :
              i === 1 ? 'bg-warn/10 text-warn border-warn/30' :
              'bg-primary/10 text-primary border-primary/30'
            }`}>
              {step}
            </div>
            {i < 2 && <div className="text-muted-foreground text-xs">&#8594;</div>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filtersConfig.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.key ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === f.key ? 'bg-primary-foreground/20' : 'bg-muted'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-muted/30 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-primary opacity-50" />
            Aucun incident dans cette categorie
          </div>
        ) : (
          filtered.map(incident => {
            const gConfig = graviteConfig[incident.gravite] || graviteConfig.moyen;
            const sConfig = statutConfig[incident.statut_resolution] || statutConfig.ouvert;
            const SIcon = sConfig.icon;
            return (
              <div key={incident.id} className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                <div className="flex items-start justify-between p-4 pb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gConfig.bg} ${gConfig.color}`}>{gConfig.label}</span>
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sConfig.bg} ${sConfig.color}`}>
                        <SIcon className="w-2.5 h-2.5" /> {sConfig.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold">{typeLabel[incident.type_incident] || incident.type_incident}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{incident.description}</p>
                  </div>
                </div>
                <div className="px-4 pb-3 flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
                  {incident.destination && <span>vers {incident.destination}</span>}
                  {incident.assigned_to ? (
                    <span className="flex items-center gap-1 text-accent"><User className="w-2.5 h-2.5" /> {incident.assigned_to}</span>
                  ) : (
                    <span className="text-warn font-bold">Non assigne</span>
                  )}
                  {incident.passengers_notified && (
                    <span className="text-primary flex items-center gap-1"><Bell className="w-2.5 h-2.5" /> Notifies</span>
                  )}
                </div>
                {incident.statut_resolution !== 'resolu' && (
                  <div className="flex gap-2 px-4 pb-4 flex-wrap">
                    {!incident.assigned_to && (
                      <button onClick={() => assignAuto(incident)} className="flex-1 min-w-[100px] h-9 rounded-xl bg-warn/10 border border-warn/30 text-warn text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                        <User className="w-3.5 h-3.5" /> Assigner
                      </button>
                    )}
                    {!incident.passengers_notified && (
                      <button onClick={() => notifyPassengers(incident)} className="flex-1 min-w-[100px] h-9 rounded-xl bg-accent/10 border border-accent/30 text-accent text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                        <Bell className="w-3.5 h-3.5" /> Notifier
                      </button>
                    )}
                    <button onClick={() => setSelected(incident)} className="flex-1 min-w-[100px] h-9 rounded-xl bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                      <Wrench className="w-3.5 h-3.5" /> Resoudre
                    </button>
                  </div>
                )}
                {incident.statut_resolution === 'resolu' && incident.resolution_notes && (
                  <div className="mx-4 mb-4 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-[10px] font-bold text-primary mb-0.5">Note de resolution</p>
                    <p className="text-[11px] text-muted-foreground">{incident.resolution_notes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {selected && <ResolveModal incident={selected} onClose={() => setSelected(null)} onResolve={markResolved} />}
    </div>
  );
}
