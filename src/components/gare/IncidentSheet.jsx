import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { useGare } from '@/lib/GareContext';

const TYPES = [
  { key: 'panne', label: 'Panne véhicule' },
  { key: 'accident', label: 'Accident' },
  { key: 'retard_majeur', label: 'Retard majeur' },
  { key: 'passager_malade', label: 'Passager malade' },
  { key: 'route_bloquee', label: 'Route bloquée' },
  { key: 'autre', label: 'Autre' },
];
const GRAVITES = ['faible', 'moyen', 'grave', 'critique'];

export default function IncidentSheet() {
  const { sheetData: voyage, addToast, closeSheet } = useGare();
  const queryClient = useQueryClient();
  const [type_incident, setType] = useState('panne');
  const [gravite, setGravite] = useState('moyen');
  const [description, setDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: () => base44.entities.Incident.create({
      type_incident, gravite, description,
      voyage_id: voyage?.id,
      destination: voyage?.destination,
      code_voyage: voyage?.code_voyage,
      statut_resolution: 'ouvert',
      passengers_notified: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      addToast('Incident signalé', 'warn');
      setDescription('');
      closeSheet();
    },
    onError: () => addToast("Erreur lors du signalement", 'error'),
  });

  return (
    <BottomSheet name="signaler-incident" title={`Signaler un incident — ${voyage?.destination || ''}`}>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => (
              <button key={t.key} onClick={() => setType(t.key)}
                className={`h-10 rounded-xl text-[11px] font-bold border transition-colors ${
                  type_incident === t.key ? 'bg-destructive/15 text-destructive border-destructive/30' : 'bg-muted/30 text-muted-foreground border-border/30'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Gravité</label>
          <div className="flex gap-2">
            {GRAVITES.map((g) => (
              <button key={g} onClick={() => setGravite(g)}
                className={`flex-1 h-9 rounded-xl text-[11px] font-bold border capitalize transition-colors ${
                  gravite === g ? 'bg-warn/15 text-warn border-warn/30' : 'bg-muted/30 text-muted-foreground border-border/30'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Décrivez ce qui s'est passé..."
            className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>
        <button
          onClick={() => createMutation.mutate()}
          disabled={!description || createMutation.isPending}
          className="w-full h-12 rounded-2xl bg-destructive text-destructive-foreground font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          <AlertTriangle className="w-4 h-4" /> {createMutation.isPending ? 'Envoi...' : "Signaler l'incident"}
        </button>
      </div>
    </BottomSheet>
  );
}
