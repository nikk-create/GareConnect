import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigation } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { useGare } from '@/lib/GareContext';

const EMPTY = {
  destination: '', origine: 'Cotonou', heure_depart: '', date_depart: '',
  places_total: 18, chauffeur: '', vehicule: '', prix: '',
};

export default function NouveauDepartSheet() {
  const { addToast, closeSheet } = useGare();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const createMutation = useMutation({
    mutationFn: () => base44.entities.Voyage.create({
      ...form,
      places_total: Number(form.places_total),
      prix: form.prix ? Number(form.prix) : null,
      places_occupees: 0,
      progression: 0,
      statut: 'planifie',
      code_voyage: 'GC-' + Date.now().toString(36).toUpperCase().slice(-6),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voyages'] });
      addToast('Départ créé avec succès', 'success');
      setForm(EMPTY);
      closeSheet();
    },
    onError: () => addToast('Erreur lors de la création', 'error'),
  });

  return (
    <BottomSheet name="nouveau-depart" title="Nouveau départ">
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Destination *</label>
          <input value={form.destination} onChange={set('destination')} placeholder="Parakou"
            className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Origine</label>
          <input value={form.origine} onChange={set('origine')}
            className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Date</label>
            <input type="date" value={form.date_depart} onChange={set('date_depart')}
              className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Heure *</label>
            <input type="time" value={form.heure_depart} onChange={set('heure_depart')}
              className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono focus:outline-none focus:border-primary/50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Places *</label>
            <input type="number" value={form.places_total} onChange={set('places_total')}
              className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Prix FCFA</label>
            <input type="number" value={form.prix} onChange={set('prix')}
              className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono focus:outline-none focus:border-primary/50" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Chauffeur *</label>
          <input value={form.chauffeur} onChange={set('chauffeur')}
            className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Véhicule (immatriculation)</label>
          <input value={form.vehicule} onChange={set('vehicule')}
            className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono uppercase focus:outline-none focus:border-primary/50" />
        </div>

        <button
          onClick={() => createMutation.mutate()}
          disabled={!form.destination || !form.heure_depart || !form.chauffeur || createMutation.isPending}
          className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          <Navigation className="w-4 h-4" /> {createMutation.isPending ? 'Création...' : 'Créer le départ'}
        </button>
      </div>
    </BottomSheet>
  );
}
